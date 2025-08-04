import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function getLicenceService(id: string) {
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
