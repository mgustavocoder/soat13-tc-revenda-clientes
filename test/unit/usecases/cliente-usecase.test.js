import assert from 'node:assert/strict'
import test from 'node:test'
import { ClienteUsecase } from '../../../src/application/usecases/cliente-usecase.js'
import { Cliente } from '../../../src/domain/entities/cliente.js'
import { InvalidInputError } from '../../../src/domain/errors/invalid-input-error.js'
import { ResourceNotFoundError } from '../../../src/domain/errors/resource-not-found-error.js'

const makeRepository = (clientes = []) => ({
  calls: [],
  async listar() { return clientes },
  async buscarPorCpf(cpf) {
    this.calls.push(cpf)
    return clientes.find(cliente => cliente.cpf === cpf)
  },
  async criar(cliente) { return new Cliente({ ...cliente, id: 1 }) }
})

test('buscarPorCpf normalizes the CPF before querying the repository', async () => {
  const repository = makeRepository([new Cliente({ id: 3, nome: 'Ana', cpf: '12345678901', email: 'a@a.com' })])
  const usecase = new ClienteUsecase(repository)
  const cliente = await usecase.buscarPorCpf('123.456.789-01')
  assert.equal(cliente.id, 3)
  assert.deepEqual(repository.calls, ['12345678901'])
})

test('buscarPorCpf rejects invalid CPFs and reports missing clients', async () => {
  const usecase = new ClienteUsecase(makeRepository())
  await assert.rejects(usecase.buscarPorCpf('abc'), InvalidInputError)
  await assert.rejects(usecase.buscarPorCpf('12345678901'), ResourceNotFoundError)
})

test('cadastrar validates through the entity and persists it', async () => {
  const usecase = new ClienteUsecase(makeRepository())
  const cliente = await usecase.cadastrar({ nome: 'Ana Souza', cpf: '12345678901', email: 'ana@email.com' })
  assert.equal(cliente.id, 1)
  await assert.rejects(usecase.cadastrar({ nome: 'A' }), InvalidInputError)
})
