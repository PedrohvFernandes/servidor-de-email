import { EmailClient } from '../src/email/email.client'
import imap from 'imap'
// jest.useFakeTimers() // --> https://stackoverflow.com/questions/50793885/referenceerror-you-are-trying-to-import-a-file-after-the-jest-environment-has#comment114948772_50793993
// jest.setTimeout(10000)

describe('EmailClient', () => {

  const config: imap.Config = {
    user: process.env.EMAIL_USER as string,
    password: process.env.EMAIL_PASS_APP2F as string ,
    host: process.env.EMAIL_HOST_IMAP as string,
    port: Number(process.env.EMAIL_PORT_IMAP) || 993,
    tls: true,
    tlsOptions: { 
      // servername: process.env.EMAIL_HOST_IMAP as string, 
      rejectUnauthorized: false
     },
    
  }
  const emailClient = new EmailClient(config)


  it('should list all emails', async () => {
    const emails = await emailClient.list()
    console.log('Quantidade de emails: ', emails.length)
    expect(emails).toBeInstanceOf(Array)
    expect(emails.length).toBeGreaterThan(0)
  }) //60000 --> Colocar no it como segundo parametro para aumentar o tempo de espera, quando o Jest não recebe uma resposta do teste dentro do tempo limite de 5 segundos (ou outro tempo limite definido), "Exceeded timeout of 5000 ms for a test." com isso vai dar para ver o erro que esta acontecendo
})
