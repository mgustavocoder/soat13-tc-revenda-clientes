import { ClienteRepository } from '../../application/gateways/cliente-repository.js'
import { Cliente } from '../../domain/entities/cliente.js'
import { DuplicateResourceError } from '../../domain/errors/duplicate-resource-error.js'

const toCliente = (row) => new Cliente({
  id: row.id,
  nome: row.nome,
  cpf: row.cpf,
  email: row.email
})

class MysqlClienteRepository extends ClienteRepository {
  constructor(db) {
    super()
    this.db = db
  }

  async listar() {
    const [rows] = await this.db.execute('SELECT id, nome, cpf, email FROM clientes ORDER BY id')
    return rows.map(toCliente)
  }

  async buscarPorCpf(cpf) {
    const [rows] = await this.db.execute(
      'SELECT id, nome, cpf, email FROM clientes WHERE cpf = ? LIMIT 1',
      [cpf]
    )
    return rows[0] ? toCliente(rows[0]) : undefined
  }

  async criar(cliente) {
    try {
      const [result] = await this.db.execute(
        'INSERT INTO clientes (nome, cpf, email) VALUES (?, ?, ?)',
        [cliente.nome, cliente.cpf, cliente.email]
      )
      return new Cliente({ ...cliente, id: result?.insertId ?? null })
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new DuplicateResourceError('Cliente já cadastrado com esse CPF ou e-mail.')
      }
      throw error
    }
  }
}

export { MysqlClienteRepository }
