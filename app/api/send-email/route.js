import Email from "vercel-email";

export async function POST(request) {
  const { name, email, subject, message } = await request.json();

  await Email.send({
    to: process.env.OUTLOOK_EMAIL,
    from: { email: process.env.OUTLOOK_EMAIL, name: name },
    subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
    text: message,
    html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    replyTo: email,
  });
}
export const runtime = "edge";
