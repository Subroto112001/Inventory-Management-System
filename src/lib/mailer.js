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

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background-color:#f4f5f7; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 40px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size: 20px; letter-spacing: 0.5px;">Inventory Management</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <p style="margin:0 0 8px; font-size: 16px; color:#111827;">Hello ${name},</p>
                <p style="margin:0 0 24px; font-size: 15px; color:#4b5563; line-height:1.6;">
                  You've been invited to join Inventory Management. Use the verification code below to continue.
                </p>

                <!-- Code Box -->
                <div style="background-color:#f4f5f7; border: 1px dashed #c7c9d9; border-radius: 10px; padding: 20px; text-align:center; margin-bottom: 24px;">
                  <span style="font-size: 30px; font-weight:700; letter-spacing: 8px; color:#4f46e5;">${code}</span>
                  <p style="margin: 10px 0 0; font-size: 13px; color:#9ca3af;">This code expires in 15 minutes</p>
                </div>

                ${
                  invitationUrl
                    ? `
                <!-- CTA Button -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${invitationUrl}" style="display:inline-block; background-color:#4f46e5; color:#ffffff; text-decoration:none; font-size:15px; font-weight:600; padding: 14px 32px; border-radius: 8px;">
                        Set Your Password
                      </a>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }

                <p style="margin: 28px 0 0; font-size: 13px; color:#9ca3af; line-height:1.6;">
                  If you did not expect this invitation, you can safely ignore this email or contact your system administrator.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f9fafb; padding: 20px 40px; text-align:center; border-top: 1px solid #eee;">
                <p style="margin:0; font-size: 12px; color:#9ca3af;">
                  &copy; ${new Date().getFullYear()} Inventory Management. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const text = `Hello ${name},

Your verification code is ${code}. It expires in 15 minutes.${
    invitationUrl
      ? `

Set your password: ${invitationUrl}`
      : ""
  }

If you did not expect this invitation, contact your system administrator.`;

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Your Inventory Management invitation code",
    text,
    html,
  });
}
