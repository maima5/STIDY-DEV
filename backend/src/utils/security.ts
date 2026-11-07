import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

const BCRYPT_COST = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, BCRYPT_COST);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
// dipakai saat user tidak ditemukan, supaya waktu respons login tidak membocorkan keberadaan akun
export const DUMMY_HASH = bcrypt.hashSync('dummy-password', BCRYPT_COST);

export const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_SECONDS });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;

/** Token acak untuk refresh token & verifikasi email. Yang disimpan di DB hanya hash-nya. */
export const randomToken = () => crypto.randomBytes(32).toString('base64url');
export const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
