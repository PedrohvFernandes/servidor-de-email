import { EmailClient } from './email/email.client'
import { EmailService } from './email/email.service'
import { createTransport } from 'nodemailer'

async function main() {
  const emailClient = new EmailClient({
    // https://basedeconhecimento.ramper.com.br/en/articles/4739213-como-encontrar-o-imap-e-smtp-do-meu-servidor-de-e-mail
    // https://kinsta.com/pt/blog/servidor-smtp-gmail/
    // https://cursos.alura.com.br/forum/topico-problemas-ao-enviar-e-mail-com-o-nodemailer-229798
    // https://www.hostinger.com.br/tutoriais/aprenda-a-utilizar-o-smtp-google
    // https://github.com/mscdex/node-imap/issues/705 --> Connection error: Error: self signed certificate
    // https://stackoverflow.com/questions/26948516/nodemailer-invalid-login
    // https://github.com/nodemailer/nodemailer
    // https://www.courier.com/error-solutions/535-authentication-failed-nodemailer/
    // https://www.youtube.com/watch?v=xvX4gWRWIVY --> Nodejs nodemailer Username and Password not accepted | On May 30 2022, you may lose access to apps
    // https://stackoverflow.com/questions/56475264/im-using-imap-npm-library-for-fetching-mails-which-says-invalid-credentials
    // https://www.npmjs.com/package/imap
    // https://stackoverflow.com/questions/59633564/cannot-connect-to-gmail-using-imap
    // https://stackoverflow.com/questions/60701936/error-invalid-login-application-specific-password-required
    // https://support.google.com/mail/thread/182882752/application-specific-password-required?hl=en
    // https://support.mozilla.org/bm/questions/1344340 -->     Timed out while authenticating with server
    // https://stackoverflow.com/questions/38366894/coffeescript-timeout-error-while-authenticating-with-server-using-node-imap
    // https://github.com/mscdex/node-imap/issues/432 -->  Timed out while authenticating with server
    // https://knowledge.hubspot.com/email-tracking/troubleshoot-imap-inbox-connection#:~:text=IMAP%20authentication%20error&text=Confirm%20the%20IMAP%20server%20and%20port%20settings%20are%20correct.,visibility%20into%20these%20authentication%20errors.
    // https://tomticket.tomticket.com/kb/perguntas-frequentes/nao-e-possivel-ler-emails-no-gmail --> Não é possível ler emails no Gmail /  Invalid credentials (Failure)
    // https://appuals.com/fix-your-imap-server-wants-to-alert-you-invalid-credentials/
    // https://support.google.com/accounts/thread/166395190/keep-getting-authenticationfailed-invalid-credentials-failure-error-in-outlook?hl=en
    // https://www.rtcom.me/fix-gmail-imap-invalid-credentials-or-web-login-requires-failure-error/
    // https://sites.google.com/site/inforlae/configurar-gmail-no-outlook
    // https://www.getmailbird.com/setup/pt/access-gmail-com-via-imap-smtp
    // https://support.google.com/mail/answer/7104828?authuser=1&hl=pt-BR&authuser=1&visit_id=638161441657958991-2270005384&rd=1#zippy=%2Cnão-consigo-fazer-login-no-meu-cliente-de-e-mail
    // https://support.google.com/mail/answer/7126229?hl=pt-BR#zippy=%2Cetapa-verificar-se-o-imap-está-ativado%2Cetapa-alterar-o-smtp-e-outras-configurações-no-seu-cliente-de-e-mail
    // https://knowledge.hubspot.com/pt/email-tracking/troubleshoot-imap-inbox-connection#:~:text=Confirme%20se%20o%20servidor%20IMAP,à%20sua%20caixa%20de%20entrada.
    // https://developers.google.com/gmail/imap/imap-smtp?hl=pt-br
    // https://www.youtube.com/watch?v=hu9xp4piYPs --> Enable IMAP to check Gmail through other email platforms
    // https://support.google.com/mail/answer/7126229?hl=en#zippy=%2Cstep-check-that-imap-is-turned-on%2Cstep-change-smtp-other-settings-in-your-email-client

    // Lembrando a conta não pode ter 2 fatores de autenticação, se tiver tem que permitir quais apps podem acessar Application-specific password required --> https://accounts.google.com/signin/v2/challenge/pwd?TL=ADBc5UNvapIT3HU7KdrtPR-7RNyTyXD1yJzFaD50L07vcLkAi-Sf3lPu76pDznDW&cid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fu%2F0%2Fsigninoptions%2Ftwo-step-verification%3Frapt%3DAEjHL4Pcb3F_JG0TZEDEHScXNID6HXuhuhxyo-rbcQO7g3M2JnTFdpmub-pbhUKgNZpojaV1DEDmzu8zWVFaffKDFms_WpJ7tA&flowName=GlifWebSignIn&ifkv=AQMjQ7TLLLBX23svTQ6eU-12KKh6ZqjNR9gKd-mYVNeamFmjMaEUIl99xwCc-bMPByW71-8UP9J_vA&rart=ANgoxcfBFjI5ij4X9nKIGTbWZzzGf5TL44w8NdU9o9Fs69LkGIIEX7gazv-KsvRAgxvKiQd_6Bf723rQ7wkCT9-tPsdlGOOUMA&sarp=1&scc=1&service=accountsettings&flowEntry=ServiceLogin
    // https://www.youtube.com/watch?v=u56XfZaDRe4 --> INVALID CREDENTIALS
    // https://support.google.com/mail/thread/193657761/cannot-connect-to-imap-authenticationfailed-invalid-credentials-failure?hl=en

    // Antivirus pode bloquear o envio de email
    // Tem que ativar o IMAP no gmail
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
