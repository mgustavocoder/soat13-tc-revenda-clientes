import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { createApp } from '../src/app.js'

const withServer = async (app, callback) => {
  const server = app.listen(0)
  await once(server, 'listening')
  try {
    await callback(`http://127.0.0.1:${server.address().port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
}

test('health endpoint responds without using the database', async () => {
  const app = createApp({ db: { execute: async () => { throw new Error('unexpected database query') } } })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'healthy' })
  })
})

test('internal CPF lookup returns the client identity for API consumers', async () => {
  const db = {
    execute: async () => [[{ id: 8, nome: 'Maria Silva', cpf: '12345678901', email: 'maria@email.com' }]]
  }
  const app = createApp({ db })
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/internal/clientes/12345678901`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), {
      id: 8,
      nome: 'Maria Silva',
      cpf: '12345678901',
      email: 'maria@email.com'
    })
  })
})
