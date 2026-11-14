import { Cliente } from '../../domain/entities/cliente.js'
import { Cpf } from '../../domain/entities/value-objects/cpf.js'
import { InvalidInputError } from '../../domain/errors/invalid-input-error.js'
import { ResourceNotFoundError } from '../../domain/errors/resource-not-found-error.js'

class ClienteUsecase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository
  }

  async listar() {
    return this.clienteRepository.listar()
  }

  async buscarPorCpf(cpf) {
    if (!Cpf.isValid(cpf)) {
      throw new InvalidInputError('CPF inválido.')
    }
    const cliente = await this.clienteRepository.buscarPorCpf(Cpf.normalizar(cpf))
    if (!cliente) {
      throw new ResourceNotFoundError('Cliente não encontrado.')
    }
    return cliente
  }

  async cadastrar(dados) {
    const cliente = Cliente.criar(dados)
    return this.clienteRepository.criar(cliente)
  }
}

export { ClienteUsecase }
