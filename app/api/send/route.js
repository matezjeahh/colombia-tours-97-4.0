import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, email, subject, message } = await request.json();
  console.log({ name, email, subject, message });
  try {
    const { data, error } = await resend.emails.send({
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

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
