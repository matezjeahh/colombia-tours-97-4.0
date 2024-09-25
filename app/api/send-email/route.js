import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  // Verify connection configuration
  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const mailData = {
    from: {
      name: name,
      address: process.env.OUTLOOK_EMAIL,
    },
    replyTo: email,
    to: process.env.OUTLOOK_EMAIL,
    subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
    text: message,
    html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
  };

  // Send mail
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  return NextResponse.json({ status: "OK" }, { status: 200 });
}
