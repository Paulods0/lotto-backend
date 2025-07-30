import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../constants/env';
import prisma from '../../lib/prisma';
import { BadRequestError } from '../../errors';
import { loginDTO } from '../../validations/auth/login-schema';

export async function loginService(data: loginDTO) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!existingUser) throw new BadRequestError('Credenciais inválidas.');

  const isSamePassword = await bcrypt.compare(data.password, existingUser.password);

  if (!isSamePassword) {
    throw new BadRequestError('Credenciais inválidas.');
  }

  const user = { sub: existingUser.id, email: existingUser.email, role: existingUser.role };

  const accessToken = jwt.sign(user, env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}
