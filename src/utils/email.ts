import nodemailer from "nodemailer";
import {
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  FE_URL,
  EMAIL_FROM,
} from "../config";

const transporter = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: Number(MAILTRAP_PORT),
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

// kirim email generik
export async function sendEmail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const { to, subject, text, html } = options;
  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

// kirim email reset password
export async function sendResetEmail(to: string, token: string) {
  const resetLink = `${FE_URL}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: "Reset Password EventApp",
    text: `Klik link berikut untuk mengatur ulang password Anda:\n${resetLink}`,
    html: `
        <p>Klik link berikut untuk mengatur ulang password Anda:</p>
        <a href="${resetLink}">${resetLink}</a>
        `,
  });
}
