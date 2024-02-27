import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../utils/validateEnv.js";

const sendEmail = async ({ from, to, subject, text, userName }) => {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Pinshot",
      link: "https://mailgen.js/",
    },
  });

  var email = {
    body: {
      name: userName,
      intro: text || "Welcome to Pinshot",
      outro:
        "Need help, or have questions? just reply to this email, we'd love to help",
    },
  };

  var emailBody = mailGenerator.generate(email);

  try {
    let mailOptions = {
      from,
      to,
      subject,
      html: emailBody,
    };
    const transporter = nodemailer.createTransport({
        host: env.HOST,
        port: env.BREVO_PORT,
        auth: {
            user: env.USER_MAIL_LOGIN,
            pass: env.MY_BREVO_KEY,
        },
    });
    await transporter.sendMail(mailOptions);
    return {success: true, msg:"Email sent successfully"};
  } catch (error) {
    console.log(error);
    return {success: false, msg: "Failed to send email"}
  }
};

export default sendEmail;
