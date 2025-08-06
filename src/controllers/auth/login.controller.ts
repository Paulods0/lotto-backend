import type { Request, Response } from 'express';
import { oneDayFromNowInMs } from '../../utils/date';
import { login } from '../../services/auth/login.service';
import { loginSchema } from '../../validations/auth/login.schema';

export async function handle(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);

  const { accessToken, refreshToken } = await login(body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: oneDayFromNowInMs,
  });

  return res.status(200).json({ accessToken });
}
