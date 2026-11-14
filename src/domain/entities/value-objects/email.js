const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class Email {
  constructor(valor) {
    this.valor = valor
  }

  static isValid(email) {
    return typeof email === 'string' && EMAIL_PATTERN.test(email.trim())
  }

  static criar(email) {
    return new Email(email.trim())
  }

  getValor() {
    return this.valor
  }
}

export { Email }
