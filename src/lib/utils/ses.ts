import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string; // Optional plain text version
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
  });

  return transporter;
}

export async function sendEmail(options: SendEmailOptions) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  return transporter.sendMail(mailOptions);
}






// const transporter=nodemailer.createTransport({
//     host:"smtp.gmail.com",
//     port:587,
//     secure:false,
//     auth:{
//         user:process.env.SMTP_USER,
//         pass:process.env.SMTP_PASS
//     }
// })