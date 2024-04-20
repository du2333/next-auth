import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await send({
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA Code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;

  await send({
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await send({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

// 自己通过nodemailer定义一个发邮件函数
const send = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transport.sendMail({
      from: "auth@zephyrrr.win",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};
