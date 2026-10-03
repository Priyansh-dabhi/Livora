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
  await transporter.sendMail({
    from: config.smtp.from,
    to: email,
    subject: 'Verify your Livora email',
    text: `Your verification code is: ${otp}. It will expire in ${config.otp.expiryMinutes} minutes.`,
  });
};

export const sendLoginOtp = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: config.smtp.from,
    to: email,
    subject: 'Livora Login Code',
    text: `Your login code is: ${otp}. It will expire in ${config.otp.expiryMinutes} minutes.`,
  });
};
