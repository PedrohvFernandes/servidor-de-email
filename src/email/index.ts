// Uma classe para criar objeto de Email, ou seja um email

/*
A biblioteca (ou lib) mailparser é uma ferramenta de análise de e-mails para a linguagem de programação Node.js. Ela é usada para extrair informações úteis de e-mails em formato MIME, incluindo cabeçalhos, corpo de mensagens, anexos e outros metadados.
*/
import { AddressObject, simpleParser } from 'mailparser'
type Address = {
  from: string | undefined
  to: AddressObject |Array<AddressObject> | undefined
  subject: string | undefined
  text: string | undefined
  date: Date | undefined
}
export class Email {
  constructor(public Address: Address){}

  // a interface Buffer é usada para manipular dados binários, como streams de bytes. Ela representa uma região de memória de tamanho fixo que é usada para armazenar dados de forma eficiente. o Buffer pode ser um json, um array de bytes, uma string, etc.
  static async parseEmail(data: Buffer): Promise<Email> {
    // O método simpleParser() analisa um buffer de entrada e retorna um objeto de mensagem, transformando em um email/estrutura de email legivelmente.
    const parsed = await simpleParser(data)
    const {from, to, subject, text, date } = parsed

    return new Email({
      from: from?.text,
      to: to ,
      subject: subject,
      text: text,
      date: date
    })
  }
}
