/**
 * Porta de persistência de clientes. A implementação concreta fica na camada
 * de infraestrutura e deve retornar entidades `Cliente`.
 */
class ClienteRepository {
  async listar() {
    throw new Error('Method listar() must be implemented')
  }

  async buscarPorCpf() {
    throw new Error('Method buscarPorCpf() must be implemented')
  }

  /**
   * Deve lançar DuplicateResourceError quando CPF ou e-mail já existirem.
   */
  async criar() {
    throw new Error('Method criar() must be implemented')
  }
}

export { ClienteRepository }
