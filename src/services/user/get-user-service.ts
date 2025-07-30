import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';

export async function getUserService(id: string) {
  const cacheKey = `users:${id}`;

  const existingUser = await prisma.user.findUnique({ where: { id } });

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  if (!existingUser) {
    throw new NotFoundError('Usuário não encontrado.');
  }

  const exptime = 60 * 5;
  await redis.set(cacheKey, JSON.stringify(existingUser), 'EX', exptime);

  return existingUser;
}
