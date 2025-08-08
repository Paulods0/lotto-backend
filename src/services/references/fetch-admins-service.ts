import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { RedisKeys } from '../../utils/redis/keys';
import { oneDayFromNowInMs } from '../../utils/date';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';

export async function fetchManyAdmins() {
  const cacheKey = RedisKeys.admins.all();

  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const admins = await prisma.administration.findMany({
    select: {
      id: true,
      name: true,
      licences: {
        select: {
          id: true,
          reference: true,
          status: true,
        },
      },
    },
  });

  if (admins.length > 0) await setCache(cacheKey, admins);

  return admins;
}
