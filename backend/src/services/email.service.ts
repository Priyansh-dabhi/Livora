import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: config.smtp.user ? {
    user: config.smtp.user,
    pass: config.smtp.password,
  } : undefined,
});

export const sendEmailVerificationOtp = async (email: string, otp: string) => {
  console.log('==============================================');
  console.log(`📧 [DEV OTP] Verification code for ${email}: [ ${otp} ]`);
  console.log('==============================================');

  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: email,
      subject: 'Verify your Livora email',
      text: `Your verification code is: ${otp}. It will expire in ${config.otp.expiryMinutes} minutes.`,
    });
  } catch (err: any) {
    console.warn(`[Email Service Warning] Could not deliver email via SMTP (${config.smtp.host}:${config.smtp.port}):`, err?.message || err);
    if (config.isProduction) {
      throw err;
    }
  }
};

export const sendLoginOtp = async (email: string, otp: string) => {
  console.log('==============================================');
  console.log(`🔑 [DEV OTP] Login code for ${email}: [ ${otp} ]`);
  console.log('==============================================');

  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: email,
      subject: 'Livora Login Code',
      text: `Your login code is: ${otp}. It will expire in ${config.otp.expiryMinutes} minutes.`,
    });
  } catch (err: any) {
    console.warn(`[Email Service Warning] Could not deliver email via SMTP (${config.smtp.host}:${config.smtp.port}):`, err?.message || err);
    if (config.isProduction) {
      throw err;
    }
  }
};
