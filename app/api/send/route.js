import nodemailer from "nodemailer";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  // SMTP kliens konfigurálása
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587, // TLS használatával
    secure: false, // true SSL esetén
    auth: {
      user: "resend", // Resend API kulcs
      pass: process.env.RESEND_API_KEY, // Üres, nincs szükség jelszóra
    },
  });

  try {
    // E-mail küldése
    const info = await transporter.sendMail({
      from: `${name} <${process.env.OUTLOOK_EMAIL}>`, // Feladó
      to: process.env.OUTLOOK_EMAIL, // Címzett
      replyTo: email, // Válaszcím
      subject: subject || "Általános érdeklődés", // Tárgy
      text: message, // Üzenet szövege
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`, // HTML formátum
    });

    console.log("Email elküldve:", info.messageId);
    return new Response(JSON.stringify({ message: "Sikeresen elküldve" }), { status: 200 });
  } catch (error) {
    console.error("Hiba az email küldése során:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
