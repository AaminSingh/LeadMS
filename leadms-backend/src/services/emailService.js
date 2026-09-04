import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const getTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) === 465 : true,
    auth: {
      user,
      pass
    }
  });
};

const sendEmail = async (to, subject, text, html) => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const from = process.env.FROM_EMAIL || user || 'noreply@crm.local';
  const transporter = getTransporter();

  try {
    console.log(`[EmailService] Attempting to send email to: ${to} (Subject: "${subject}") from: ${from}`);
    const info = await transporter.sendMail({
      from: `"LeadMS Platform" <${from}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`[EmailService] Email successfully delivered to ${to}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] SMTP Error sending email to ${to}:`, {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

const sendConfirmationEmail = async (to, token, domain) => {
  const url = `${domain}/api/auth/confirm-email?token=${token}`;
  const subject = 'Welcome! Please confirm your email';
  const html = `<h1>Welcome to CRM Backend</h1>
                <p>Please click the link below to confirm your account:</p>
                <a href="${url}">${url}</a>`;
  return sendEmail(to, subject, url, html);
};

const sendInvitationEmail = async (to, token, domain, designation) => {
  const url = `${domain}/api/auth/accept-invitation?token=${token}`;
  const subject = 'You are invited to join the CRM as a Team Member';
  const html = `<h1>Invitation</h1>
                <p>You have been invited to join as a <strong>${designation}</strong>.</p>
                <p>Please click the link below to accept the invitation and register your account:</p>
                <a href="${url}">${url}</a>`;
  return sendEmail(to, subject, url, html);
};

const sendPasswordResetEmail = async (to, token, domain) => {
  const url = `${domain}/api/auth/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `<h1>Reset Password</h1>
                <p>You requested a password reset. Click the link below to set a new password:</p>
                <a href="${url}">${url}</a>`;
  return sendEmail(to, subject, url, html);
};

export {
  sendEmail,
  sendConfirmationEmail,
  sendInvitationEmail,
  sendPasswordResetEmail
};
