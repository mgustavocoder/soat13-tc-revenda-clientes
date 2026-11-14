import cors from 'cors'
import express from 'express'
import { xss } from 'express-xss-sanitizer'
import { Logger } from '../logger.js'
import { createHttpErrorHandler } from './http-error-handler.js'

const createApp = ({ clienteController, logger = new Logger() }) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(xss())
  app.disable('x-powered-by')

  app.get('/api/health', (req, res) => res.json({ status: 'healthy' }))

  app.get('/api/clientes', (req, res) => clienteController.listar(req, res))
  app.get('/api/clientes/:cpf', (req, res) => clienteController.buscarPorCpf(req, res))
  app.post('/api/clientes', (req, res) => clienteController.cadastrar(req, res))
  app.get('/internal/clientes/:cpf', (req, res) => clienteController.buscarPorCpfInterno(req, res))

  app.use(createHttpErrorHandler({ logger }))
  return app
}

export { createApp }
