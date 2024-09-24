import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  // Create a transporter using Outlook's SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Outlook's SMTP server
    port: 465,
    secure: true, // Use TLS
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  try {
    // Verify the connection configuration
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

    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: process.env.OUTLOOK_EMAIL, // You can send to the same email or a different one
      replyTo: email, // The email address of the person who filled out the form
      subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
      text: `${name}\n\nEmail: ${email}\n\n${message}`,
    };

    // Send the email
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }
}
