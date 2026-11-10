import cors from 'cors'
import express from 'express'
import { xss } from 'express-xss-sanitizer'
import { createPool } from 'mysql2/promise'

const createApp = ({ db = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'clientes_db',
  waitForConnections: true,
  connectionLimit: 10
}) } = {}) => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(xss())
  app.disable('x-powered-by')

  app.get('/api/health', (req, res) => res.json({ status: 'healthy' }))

  app.get('/api/clientes', async (req, res) => {
    const [rows] = await db.execute('SELECT nome, cpf, email FROM clientes ORDER BY id')
    return res.status(200).json(rows)
  })

  const getCliente = async (cpf) => {
    const normalizedCpf = String(cpf || '').replace(/\D/g, '')
    if (normalizedCpf.length !== 11) {
      const error = new Error('CPF inválido.')
      error.status = 400
      throw error
    }
    const [rows] = await db.execute(
      'SELECT id, nome, cpf, email FROM clientes WHERE cpf = ? LIMIT 1',
      [normalizedCpf]
    )
    return rows[0]
  }

  app.get('/api/clientes/:cpf', async (req, res) => {
    const cliente = await getCliente(req.params.cpf)
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' })
    const { id, ...publicCliente } = cliente
    return res.status(200).json(publicCliente)
  })

  app.get('/internal/clientes/:cpf', async (req, res) => {
    const cliente = await getCliente(req.params.cpf)
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' })
    return res.status(200).json(cliente)
  })

  app.post('/api/clientes', async (req, res) => {
    const { nome, cpf, email } = req.body || {}
    const normalizedCpf = String(cpf || '').replace(/\D/g, '')
    if (typeof nome !== 'string' || nome.trim().length < 3 || normalizedCpf.length !== 11 ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Informe nome, CPF e e-mail válidos.' })
    }
    await db.execute(
      'INSERT INTO clientes (nome, cpf, email) VALUES (?, ?, ?)',
      [nome.trim(), normalizedCpf, email.trim()]
    )
    return res.status(201).json({ nome: nome.trim(), cpf: normalizedCpf, email: email.trim() })
  })

  app.use((error, req, res, next) => {
    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Cliente já cadastrado com esse CPF ou e-mail.' })
    }
    if (error?.status) return res.status(error.status).json({ message: error.message })
    console.error('Falha no serviço de clientes:', error)
    return res.status(500).json({ message: 'Erro interno no serviço de clientes.' })
  })

  return app
}

export { createApp }
