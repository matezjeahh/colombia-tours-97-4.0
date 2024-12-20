import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, email, subject, message } = await request.json();
  const response = await resend.emails.send({
    from: {
      name: name,
      address: process.env.OUTLOOK_EMAIL,
    },
    replyTo: email,
    to: process.env.OUTLOOK_EMAIL,
    subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
    text: message,
    html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
  });

  if (response.error) {
    console.error("Resend error:", response.error);
    return new Response(JSON.stringify({ error: response.error }), { status: 500 });
  }

  return new Response(JSON.stringify(response), { status: 200 });
}
