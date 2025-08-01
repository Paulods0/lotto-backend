import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import redis from '../../lib/redis';

export async function logoutController(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  const token = parts[1];

  if (!token) return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token não fornecido.' });
  res.clearCookie('refreshToken');
  
  const cached = await redis.get('profile')
  if(cached) {
    await redis.del('profile')
  }
  
  return res.status(HttpStatus.OK).json({ message: 'Logout realizado com sucesso.' });
}
