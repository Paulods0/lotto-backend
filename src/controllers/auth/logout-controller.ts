import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import redis from '../../lib/redis';

export async function logoutController(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Não autorizado.' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token malformado.' });
  }

  const token = parts[1];
  if (!token) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Token não fornecido.' });
  }

  // Limpa o cookie de refresh token (caso use)
  res.clearCookie('refreshToken');

  // Remove o perfil do Redis (ou outros dados de sessão)
  const cached = await redis.get('profile');
  if (cached) {
    await redis.del('profile');
  }

  // Limpa req.user, se quiser garantir que os dados do usuário não fiquem disponíveis
  req.user = undefined;

  return res.status(HttpStatus.OK).json({ message: 'Logout realizado com sucesso.' });
}
