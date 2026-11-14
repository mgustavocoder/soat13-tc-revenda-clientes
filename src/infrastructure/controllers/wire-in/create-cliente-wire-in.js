class CreateClienteWireIn {
  static fromRequest(body) {
    const { nome, cpf, email } = body && typeof body === 'object' ? body : {}
    return { nome, cpf, email }
  }
}

export { CreateClienteWireIn }
