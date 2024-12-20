import Email from "vercel-email";

export async function POST() {
  await Email.send({
    to: "colombiatours97@hotmail.com",
    from: "colombiatours97@hotmail.com",
    subject: "Hello World",
    html: "<h1>Hello World</h1>",
  });
}
export const runtime = "edge";
