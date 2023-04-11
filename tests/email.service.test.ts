import { EmailService } from "../src/email/email.service";
import { createTransport } from "nodemailer";

describe("EmailService", () => {
  const emailService = new EmailService(
    createTransport({
      host: process.env.EMAIL_HOST_SMTP as string,
      port: Number(process.env.EMAIL_PORT_SMTP) || 465,
      // De quem
      from: process.env.EMAIL_FROM as string,
      // Auth do "de quem" no caso eu
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS_APP2F as string,
      },
      // tls:{
      //   rejectUnauthorized: false
      // }
    })
  );

  it("should send an email", async () => {
    // para quem
    const to = "pedrohv20fernandes@gmail.com";
    // Assunto
    const subject = "Testando o envio de email";
    // Texto
    const text = "Este email foi enviado pelo Node.JS com Nodemailer e Jest";
    const info = await emailService.sendMail(to, subject, text);
    expect(info).toBeDefined();
  });
});
