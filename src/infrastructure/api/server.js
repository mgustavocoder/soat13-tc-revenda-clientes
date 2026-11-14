import 'dotenv/config'
import { controllersFactory } from '../controllers/controllers-factory.js'
import { createMysqlPool } from '../datasource/mysql-connection.js'
import { Logger } from '../logger.js'
import { createApp } from './app.js'

const logger = new Logger()
const port = Number(process.env.CLIENTES_PORT || 3001)
const db = createMysqlPool()
const app = createApp({ ...controllersFactory({ db }), logger })

app.listen(port, '0.0.0.0', () => {
  logger.info(`Serviço de clientes disponível na porta ${port}`)
})
