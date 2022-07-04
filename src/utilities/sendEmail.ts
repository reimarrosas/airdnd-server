import {createTransport} from "nodemailer";

export const sendEmail = async ({to, subject, content}: Email) => {
  const user = process.env["TRANSPORT_EMAIL"];
  const pass = process.env["TRANSPORT_PASS"];

  const transporter = createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    auth: {
      user,
      pass,
    },
  });
  await transporter.sendMail({
    from: `AirDND <${user}`,
    to,
    subject,
    html: content
  });
}
