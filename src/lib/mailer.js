import nodemailer from "nodemailer";

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    throw new Error("SMTP_USER and SMTP_PASS are required");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export async function sendInvitationCode({ email, name, code }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const invitationUrl = process.env.APP_URL
    ? `${process.env.APP_URL}/invitation?email=${encodeURIComponent(email)}`
    : null;
  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your Inventory Management invitation code",
    text: `Hello ${name},\n\nYour verification code is ${code}. It expires in 15 minutes.${invitationUrl ? `\n\nSet your password: ${invitationUrl}` : ""}\n\nIf you did not expect this invitation, contact your system administrator.`,
    html: `<p>Hello ${name},</p><p>Your verification code is <strong style="font-size: 24px; letter-spacing: 4px">${code}</strong>.</p><p>It expires in 15 minutes.</p>${invitationUrl ? `<p><a href="${invitationUrl}">Set your password</a></p>` : ""}<p>If you did not expect this invitation, contact your system administrator.</p>`,
  });
}
