import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  const fromName = process.env.EMAIL_FROM_NAME || "HETNEX";
  const fromAddress = process.env.SMTP_USER || "";

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
  });

  return info;
}

export function buildPasswordResetEmail(resetLink: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">HETNEX</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:500;">Business Directory Platform</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:800;">Reset Your Password</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your HETNEX account. Click the button below to choose a new password. This link is valid for <strong>1 hour</strong>.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetLink}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#0f766e,#0d9488);color:#ffffff;text-decoration:none;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.3px;">
                  Reset My Password
                </a>
              </div>
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0;word-break:break-all;color:#0d9488;font-size:13px;">${resetLink}</p>
              <hr style="margin:32px 0;border:none;border-top:1px solid #f3f4f6;" />
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} HETNEX. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
