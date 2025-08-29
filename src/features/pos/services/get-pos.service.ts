import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { getCache } from '../../../utils/redis/get-cache';
import { RedisKeys } from '../../../utils/redis/keys';
import { setCache } from '../../../utils/redis/set-cache';

export async function getPos(id: string) {
  const cacheKey = RedisKeys.pos.byId(id);

  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) throw new NotFoundError('Pos não encontrado.');

  await setCache(cacheKey, pos);

  return pos;
}
