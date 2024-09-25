import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  // Create a transporter using Outlook's SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Outlook's SMTP server
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: process.env.OUTLOOK_EMAIL, // You can send to the same email or a different one
    replyTo: email, // The email address of the person who filled out the form
    subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
    text: `${name}\n\nEmail: ${email}\n\n${message}`,
  };

  try {
    // Use await here to ensure the email is sent before responding
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Error sending email" }, { status: 500 });
  }
}
