import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function getUserService(id: string) {
  const cacheKey = RedisKeys.users.byId(id);
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) throw new NotFoundError('Usuário não encontrado.');

  await setCache(cacheKey, existingUser);

  return existingUser;
}
