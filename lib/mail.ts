import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;

  const confirmationLink = `${domain}/auth/new-verification?token=${token}`;

  await send({
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm email</p>`,
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
