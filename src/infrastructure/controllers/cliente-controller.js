import { CreateClienteWireIn } from './wire-in/create-cliente-wire-in.js'

class ClienteController {
  constructor(clienteUsecase) {
    this.clienteUsecase = clienteUsecase
  }

  async listar(req, res) {
    const clientes = await this.clienteUsecase.listar()
    res.status(200).json(clientes.map(cliente => cliente.toPublic()))
  }

  async buscarPorCpf(req, res) {
    const cliente = await this.clienteUsecase.buscarPorCpf(req.params.cpf)
    res.status(200).json(cliente.toPublic())
  }

  async buscarPorCpfInterno(req, res) {
    const cliente = await this.clienteUsecase.buscarPorCpf(req.params.cpf)
    res.status(200).json(cliente.toInternal())
  }

  async cadastrar(req, res) {
    const cliente = await this.clienteUsecase.cadastrar(CreateClienteWireIn.fromRequest(req.body))
    res.status(201).json(cliente.toPublic())
  }
}

export { ClienteController }
