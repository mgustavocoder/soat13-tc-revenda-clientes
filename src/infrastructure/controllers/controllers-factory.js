import { ClienteUsecase } from '../../application/usecases/cliente-usecase.js'
import { MysqlClienteRepository } from '../datasource/mysql-cliente-repository.js'
import { ClienteController } from './cliente-controller.js'

const controllersFactory = ({ db }) => {
  const clienteRepository = new MysqlClienteRepository(db)
  const clienteUsecase = new ClienteUsecase(clienteRepository)
  return { clienteController: new ClienteController(clienteUsecase) }
}

export { controllersFactory }
