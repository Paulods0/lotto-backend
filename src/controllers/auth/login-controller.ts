import { oneDayFromNowInMs } from './../../utils/date';
import type { Request, Response } from 'express';
import { loginService } from '../../services/auth/login-service';
import { loginSchema } from '../../validations/auth/login-schema';

export async function loginController(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);

  const { accessToken, refreshToken } = await loginService(body);

  res.cookie('refreshToken', refreshToken, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
    maxAge: oneDayFromNowInMs,
  });

  return res.status(200).json({ accessToken });
}
