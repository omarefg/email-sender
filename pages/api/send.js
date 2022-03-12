import nodemailer from "nodemailer";

const xMail = process.env.X_MAIL
const transporterHost = process.env.TRANSPORTER_HOST
const transporterPort = process.env.TRANSPORTER_PORT
const transporterUser = process.env.TRANSPORTER_USER
const transporterPass = process.env.TRANSPORTER_PASS
const transporterReceiver = process.env.TRANSPORTER_RECEIVER

export default async function handler(req, res) {
  if (req.headers["x-mail"] !== xMail) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.method === "POST") {
    const transporter = nodemailer.createTransport({
      host: transporterHost,
      port: transporterPort,
      auth: {
        user: transporterUser,
        pass: transporterPass,
      },
    });

    try {
      await transporter.sendMail({
        from: transporterUser,
        subject: `Message from ${transporterUser} to ${transporterReceiver} at ${new Date()}`,
        html: `<p>${JSON.stringify(req.body)}</p>`,
        to: transporterReceiver
      });
      res.status(200).send("Done");
    } catch (error) {
      res.status(500).send(error.message);
    }
    return;
  }

  res.status(405).send("Method not allowed");
}
