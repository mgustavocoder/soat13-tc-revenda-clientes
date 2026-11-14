import { InvalidInputError } from '../errors/invalid-input-error.js'
import { Cpf } from './value-objects/cpf.js'
import { Email } from './value-objects/email.js'

const NOME_TAMANHO_MINIMO = 3

class Cliente {
  constructor({ id = null, nome, cpf, email }) {
    this.id = id
    this.nome = nome
    this.cpf = cpf
    this.email = email
  }

  static criar({ nome, cpf, email }) {
    if (typeof nome !== 'string' || nome.trim().length < NOME_TAMANHO_MINIMO ||
      !Cpf.isValid(cpf) || !Email.isValid(email)) {
      throw new InvalidInputError('Informe nome, CPF e e-mail válidos.')
    }
    return new Cliente({
      nome: nome.trim(),
      cpf: Cpf.criar(cpf).getValor(),
      email: Email.criar(email).getValor()
    })
  }

  toPublic() {
    return { nome: this.nome, cpf: this.cpf, email: this.email }
  }

  toInternal() {
    return { id: this.id, ...this.toPublic() }
  }
}

export { Cliente }
