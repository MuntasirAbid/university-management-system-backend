import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: "muntasira7@gmail.com",
      pass: "hpoz fuit kgaa rnsu",
    },
  });

  await transporter.sendMail({
    from: "muntasira7@gmail.com", // sender address
    to,
    subject: "Reset your password within 10 minutes!", // Subject line
    text: "", // plain text body
    html,
  });
};
