import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';

export async function deleteUserService(id: string) {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new NotFoundError('Usuário não econtrado.');
  }

  await prisma.user.delete({
    where: { id },
  });

  const redisKeys = await redis.keys('users:*');

  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }
}
