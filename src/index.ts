import { EmailClient } from './email/email.client'
import { EmailService } from './email/email.service'
import { createTransport } from 'nodemailer'

async function main() {
  const emailClient = new EmailClient({
    user: process.env.EMAIL_USER as string,
    password: process.env.EMAIL_PASS_APP2F as string,
    host: process.env.EMAIL_HOST_IMAP as string,
    port: Number(process.env.EMAIL_PORT_IMAP) || 993,
    tls: true,
    // Ele vai ignorar o certificado do servidor
    tlsOptions: { 
      // servername: process.env.EMAIL_HOST_IMAP as string, 
      rejectUnauthorized: false
     },
  })

  // Apos logar pegamos todos os emails
  const emails = await emailClient.list()
  console.log('Quantidade de emails: ', emails.length)
  console.log(
    'Ultimo email recebido: ',
    emails[0]?.Address.subject ?? 'Sem assunto'
  )

  // Para enviar um email
  const emailService = new EmailService(
    createTransport({
      host: process.env.EMAIL_HOST_SMTP as string,
      port: Number(process.env.EMAIL_PORT_SMTP) || 465,
      // Para quem vai ser enviado o email
      from: process.env.EMAIL_FROM as string,
      // Autenticação do meu email para enviar o email
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS_APP2F as string
      }
      // tls:{
      //   rejectUnauthorized: false
      // }
    })
  )

  const info = await emailService.sendMail('', 'Subject', 'Text')
  console.log('Email enviado com sucesso: ', info)
}

main().catch(error => console.error(error))
