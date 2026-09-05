import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize Resend HTTP client if API key is provided
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// Create reusable transporter object using SMTP transport with timeouts
const getTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) === 465 : true,
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
    auth: {
      user,
      pass
    }
  });
};

// Diagnostic helper: check email environment variables on startup
export const checkEmailConfig = () => {
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const hasSmtp = Boolean(smtpUser && smtpPass);

  const status = {
    primaryEngine: hasResend ? 'Resend (HTTP API)' : hasSmtp ? 'Nodemailer (SMTP)' : 'None (Unconfigured)',
    hasResendApiKey: hasResend,
    hasSmtpCredentials: hasSmtp,
    fromEmail: process.env.FROM_EMAIL || (hasResend ? 'LeadMS <onboarding@resend.dev>' : smtpUser || 'noreply@crm.local'),
  };

  console.log('[EmailService Config Status]:', status);

  if (!hasResend && !hasSmtp) {
    console.warn('[EmailService Warning] Neither RESEND_API_KEY nor SMTP credentials (SMTP_USER/SMTP_PASS) are configured! Outbound email delivery will fail.');
  }

  return status;
};

// Dual-engine sendEmail: attempts Resend HTTP API first, then falls back to Nodemailer SMTP
const sendEmail = async (to, subject, text, html) => {
  const resendClient = getResendClient();

  // 1. Primary Engine: Resend HTTP API (avoids serverless socket timeouts & IP blocks)
  if (resendClient) {
    const fromAddress = process.env.FROM_EMAIL || 'LeadMS <onboarding@resend.dev>';
    try {
      console.log(`[EmailService:Resend] Dispatching email via HTTP to: ${to} (Subject: "${subject}") from: ${fromAddress}`);
      const { data, error } = await resendClient.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        text,
        html,
      });

      if (error) {
        console.error('[EmailService:Resend] API Error returned:', error);
        throw new Error(`Resend delivery failed: ${error.message || JSON.stringify(error)}`);
      }

      console.log(`[EmailService:Resend] Email delivered successfully. ID: ${data?.id}`);
      return { success: true, provider: 'resend', id: data?.id };
    } catch (resendErr) {
      console.error('[EmailService:Resend] Dispatch Exception:', resendErr.message);
      // If SMTP is not configured, throw immediately
      const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
      const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
      if (!smtpUser || !smtpPass) {
        throw resendErr;
      }
      console.warn('[EmailService] Falling back to secondary Nodemailer SMTP transport...');
    }
  }

  // 2. Secondary Engine / Fallback: Nodemailer SMTP
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    const error = new Error('Email service unconfigured: Missing RESEND_API_KEY and SMTP credentials (SMTP_USER / SMTP_PASS).');
    error.code = 'ENOCONFIG';
    throw error;
  }

  const from = process.env.FROM_EMAIL || user || 'noreply@crm.local';
  const transporter = getTransporter();

  try {
    console.log(`[EmailService:SMTP] Attempting SMTP delivery to: ${to} (Subject: "${subject}") from: ${from}`);
    const info = await transporter.sendMail({
      from: `"LeadMS Platform" <${from}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`[EmailService:SMTP] Email successfully delivered to ${to}. MessageId: ${info.messageId}`);
    return { success: true, provider: 'smtp', id: info.messageId };
  } catch (error) {
    const fullErrorDetails = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      command: error.command || 'N/A',
      response: error.response || 'N/A',
      responseCode: error.responseCode || 'N/A'
    };
    console.error(`[EmailService:SMTP] Full SMTP failure detail for ${to}:`, fullErrorDetails);
    error.fullErrorDetails = fullErrorDetails;
    throw error;
  }
};

const sendConfirmationEmail = async (to, token, domain) => {
  const cleanDomain = (domain || '').replace(/\/+$/, '');
  const url = `${cleanDomain}/api/auth/confirm-email?token=${token}`;
  const subject = 'Welcome to LeadMS! Please confirm your email';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0;">Lead<span style="color: #0891b2;">MS</span></h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">B2B Sales, CRM & Quotation Platform</p>
      </div>
      <div style="color: #334155; font-size: 15px; line-height: 1.6;">
        <p>Hello,</p>
        <p>Thank you for signing up for LeadMS. Please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #0891b2; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">Confirm Email Address</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">Or copy and paste this verification link into your browser:</p>
        <p style="word-break: break-all; font-size: 12px; color: #0891b2; background-color: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">${url}</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; pt: 16px;">If you did not sign up for LeadMS, please ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail(to, subject, url, html);
};

const sendInvitationEmail = async (to, token, domain, designation) => {
  const cleanDomain = (domain || '').replace(/\/+$/, '');
  const url = `${cleanDomain}/api/auth/accept-invitation?token=${token}`;
  const subject = 'You are invited to join LeadMS';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h1 style="color: #0f172a; font-size: 22px; font-weight: 800;">LeadMS Team Invitation</h1>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">You have been invited to join the LeadMS workspace as a <strong>${designation}</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #0891b2; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">Accept Invitation</a>
      </div>
      <p style="word-break: break-all; font-size: 12px; color: #64748b;">${url}</p>
    </div>
  `;
  return sendEmail(to, subject, url, html);
};

const sendPasswordResetEmail = async (to, token, domain) => {
  const cleanDomain = (domain || '').replace(/\/+$/, '');
  const url = `${cleanDomain}/api/auth/reset-password?token=${token}`;
  const subject = 'LeadMS Password Reset Request';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h1 style="color: #0f172a; font-size: 22px; font-weight: 800;">Password Reset Request</h1>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #0891b2; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">Reset Password</a>
      </div>
      <p style="word-break: break-all; font-size: 12px; color: #64748b;">${url}</p>
    </div>
  `;
  return sendEmail(to, subject, url, html);
};

export {
  sendEmail,
  sendConfirmationEmail,
  sendInvitationEmail,
  sendPasswordResetEmail
};
