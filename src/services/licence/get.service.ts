import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';

export async function getLicence(id: string) {
  const cacheKey = RedisKeys.licences.byId(id);
  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const licence = await prisma.licence.findUnique({
    where: { id },
  });

  if (!licence) throw new NotFoundError('Licença não encontrada');

  await setCache(cacheKey, licence);

  return licence;
}
