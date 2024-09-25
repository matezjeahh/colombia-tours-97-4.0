import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: true,
  },
};

export const runtime = "nodejs"; // Add this line to use Node.js runtime

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  console.log("Starting email sending process...");

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: process.env.OUTLOOK_EMAIL,
    replyTo: email,
    subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
    text: `${name}\n\nEmail: ${email}\n\n${message}`,
  };

  try {
    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return NextResponse.json({ message: "Email sent successfully", info }, { status: 200 });
  } catch (error) {
    console.error("Detailed error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
