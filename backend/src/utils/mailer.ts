import { env } from '../config/env';

// TODO: ganti dengan provider email (Resend / Nodemailer / dll).
export async function sendVerificationEmail(to: string, token: string) {
  const link = `${env.CLIENT_URL}/verify-email?token=${token}`;
  console.log(`[mailer] verifikasi untuk ${to}: ${link}`);
}
