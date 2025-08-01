import jwt from 'jsonwebtoken';
import env from '../../constants/env';
import { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import redis from '../../lib/redis';

export async function getUserProfileController(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };

    // Cria chave única por utilizador
    const cacheKey = `profile:${decoded.id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({ user: JSON.parse(cached) });
    }

    // Guarda no Redis
    const exptime = 24 * 60 * 60; // 24h em segundos (não milissegundos)
    await redis.set(cacheKey, JSON.stringify(decoded), 'EX', exptime);

    return res.status(200).json({ user: decoded });
  } catch (error) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Token inválido ou expirado.' });
  }
}
