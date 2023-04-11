// Aqui vamos enviar o email

import { Transporter } from 'nodemailer'

export class EmailService {
  constructor(private transport: Transporter) {}

  async sendMail(to: string, subject: string, text: string): Promise<string> {
    const info = await this.transport.sendMail({
      from: this.transport.options.from,
      to,
      subject,
      text
    })
    // Ele tem que nos retorna o id do email criado
    return info.messageId
  }
}
