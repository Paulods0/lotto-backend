import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function getPosService(id: string) {
  const cacheKey = RedisKeys.pos.byId(id);
  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) throw new NotFoundError('Pos não encontrado.');

  await setCache(cacheKey, pos);

  return pos;
}
