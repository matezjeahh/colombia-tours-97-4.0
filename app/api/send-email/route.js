import Email from "vercel-email";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    await Email.send({
      to: process.env.OUTLOOK_EMAIL,
      from: { email: process.env.OUTLOOK_EMAIL, name: name },
      subject: subject ? `Érdeklődés: ${subject}` : "Általános érdeklődés",
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
      replyTo: email,
    });

    return new Response(JSON.stringify({ status: "OK" }), { status: 200 });
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(JSON.stringify({ status: "Error", message: error.message }), {
      status: 500,
    });
  }
}

export const runtime = "edge";
