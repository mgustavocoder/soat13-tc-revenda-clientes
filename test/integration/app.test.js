import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { createApp } from '../../src/infrastructure/api/app.js'
import { controllersFactory } from '../../src/infrastructure/controllers/controllers-factory.js'

const silentLogger = { info() {}, warn() {}, error() {} }

const withServer = async (db, callback) => {
  const app = createApp({ ...controllersFactory({ db }), logger: silentLogger })
  const server = app.listen(0)
  await once(server, 'listening')
  try {
    await callback(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
}

const maria = { id: 8, nome: 'Maria Silva', cpf: '12345678901', email: 'maria@email.com' }

test('health endpoint responds without using the database', async () => {
  const db = { execute: async () => { throw new Error('unexpected database query') } }
  await withServer(db, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'healthy' })
  })
})

test('internal CPF lookup returns the client identity for API consumers', async () => {
  const db = { execute: async () => [[maria]] }
  await withServer(db, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/internal/clientes/123.456.789-01`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), maria)
  })
})

test('public CPF lookup hides the internal identifier and returns 404 when missing', async () => {
  let rows = [maria]
  const db = { execute: async () => [rows] }
  await withServer(db, async (baseUrl) => {
    const found = await fetch(`${baseUrl}/api/clientes/12345678901`)
    assert.equal(found.status, 200)
    assert.deepEqual(await found.json(), { nome: maria.nome, cpf: maria.cpf, email: maria.email })

    rows = []
    const missing = await fetch(`${baseUrl}/api/clientes/12345678901`)
    assert.equal(missing.status, 404)

    const invalid = await fetch(`${baseUrl}/api/clientes/123`)
    assert.equal(invalid.status, 400)
  })
})

test('client creation validates input and maps duplicate entries to 409', async () => {
  let duplicate = false
  const db = {
    execute: async () => {
      if (duplicate) throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' })
      return [{ insertId: 9 }]
    }
  }
  await withServer(db, async (baseUrl) => {
    const post = (body) => fetch(`${baseUrl}/api/clientes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    const created = await post({ nome: ' Maria Silva ', cpf: '123.456.789-01', email: 'maria@email.com' })
    assert.equal(created.status, 201)
    assert.deepEqual(await created.json(), { nome: 'Maria Silva', cpf: '12345678901', email: 'maria@email.com' })

    const invalid = await post({ nome: 'Ma', cpf: '1', email: 'x' })
    assert.equal(invalid.status, 400)

    duplicate = true
    const conflict = await post({ nome: 'Maria Silva', cpf: '12345678901', email: 'maria@email.com' })
    assert.equal(conflict.status, 409)
  })
})
