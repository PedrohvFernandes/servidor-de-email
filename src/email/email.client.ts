// Aqui é a onde a gente recebe e lista os emails

/*
A biblioteca "imap" para Node.js é uma ferramenta que permite a comunicação com servidores de e-mail utilizando o protocolo IMAP. Essa biblioteca fornece uma interface que permite conectar a um servidor de e-mail e realizar operações como autenticação, leitura de mensagens e gerenciamento de pastas.
*/
import imap from 'imap'
import { Email } from './'

export class EmailClient {
  constructor(
    // Config host, port, user, password
    private config: imap.Config
  ) {}

  // async list(): Promise<Array<Email>>
  async list(): Promise<Email[]> {
    const imapClient = new imap(this.config)
    // const emails: Email[] = [] --> pode fazer assim
    // Esse array vai ser oque vamos consumir no front para listar o emails
    const emails: Array<Email> = []

    await new Promise<void>((resolve, reject) => {
      imapClient.once('ready', () => {
        // Abrimos a caixa de entrada, para ver todos os emails
        imapClient.openBox('INBOX', false, (err, box) => {
          if (err) return reject(err)

          // Listamos todos os emails
          imapClient.search(['ALL'], (err, results) => {
            if (err) return reject(err)

            // Aqui pegamos cada email
            const fetch = imapClient.fetch(results, {
              bodies: '',
              // Aqui marca como lido quando listar todos os emails
              markSeen: true
            })

            // Percorre email por email
            fetch.on('message', msg => {
              // acessamos o corpo do email
              msg.on('body', async (stream, info) => {
                // Pegamos stream de cada email e transformamos em buffer
                const data = await streamToBuffer(stream)
                // Pegamos o buffer desse email e transformamos em um email legivel
                const email = await Email.parseEmail(data)

                // Adicionar o email na lista
                emails.push(email)
              })
            })
            fetch.once('error', reject)
            fetch.once('end', () => {
              imapClient.end()
              resolve()
            })
          })
        })
      })
      imapClient.once('error', reject)
      imapClient.once('end', () => console.log('Connection ended'))
      imapClient.connect()
    })
    return emails
  }
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Array<Buffer> = []
    stream.on('data', chunk => buffers.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
    stream.on('error', reject)
  })
}
