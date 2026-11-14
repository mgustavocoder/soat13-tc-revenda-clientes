import assert from 'node:assert/strict'
import test from 'node:test'
import { Cliente } from '../../../src/domain/entities/cliente.js'
import { Cpf } from '../../../src/domain/entities/value-objects/cpf.js'
import { InvalidInputError } from '../../../src/domain/errors/invalid-input-error.js'

test('Cliente.criar normalizes name, CPF and e-mail', () => {
  const cliente = Cliente.criar({ nome: '  João  ', cpf: '123.456.789-01', email: ' joao@email.com ' })
  assert.deepEqual(cliente.toPublic(), { nome: 'João', cpf: '12345678901', email: 'joao@email.com' })
})

test('Cliente.criar rejects invalid data', () => {
  assert.throws(() => Cliente.criar({ nome: 'Jo', cpf: '12345678901', email: 'joao@email.com' }), InvalidInputError)
  assert.throws(() => Cliente.criar({ nome: 'João', cpf: '1234', email: 'joao@email.com' }), InvalidInputError)
  assert.throws(() => Cliente.criar({ nome: 'João', cpf: '12345678901', email: 'invalido' }), InvalidInputError)
  assert.throws(() => Cliente.criar({}), InvalidInputError)
})

test('Cpf validates only the digits', () => {
  assert.equal(Cpf.isValid('123.456.789-01'), true)
  assert.equal(Cpf.isValid(undefined), false)
})
