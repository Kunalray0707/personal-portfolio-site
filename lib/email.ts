import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendVerificationEmail(email: string, userId: string) {
  if (!resend) throw new Error('Resend API key not configured');
  const token = `${userId}.${Date.now()}`; // simple token — in prod sign this (e.g., JWT)
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: 'no-reply@portfolioaipro.com',
    to: email,
    subject: 'Verify your email — Portfolio AI Pro',
    html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`
  });
}

export async function sendForgotPasswordEmail(email: string, token: string) {
  if (!resend) throw new Error('Resend API key not configured');
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${encodeURIComponent(token)}`;
  await resend.emails.send({
    from: 'no-reply@portfolioaipro.com',
    to: email,
    subject: 'Reset your password — Portfolio AI Pro',
    html: `<p>Reset your password by clicking the link below:</p><p><a href="${resetUrl}">Reset password</a></p>`
  });
}
