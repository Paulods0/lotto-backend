import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyUsers(params: PaginationParams) {
  const cacheKey = RedisKeys.users.listWithFilters(params);

  const cached = await getCache(cacheKey);

  if (cached) return cached;

  const search = buildFilters(params.query);

  let where: Prisma.UserWhereInput | undefined = {
    AND: [{ OR: search }, { role: { in: ['area_manager', 'dev', 'super_admin', 'supervisor'] } }],
  };

  const offset = (params.page - 1) * params.limit;

  const users = await prisma.user.findMany({
    where,
    take: params.limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
  });

  if (users.length > 0) await setCache(cacheKey, users);

  return users;
}

function buildFilters(query: string | undefined) {
  let filters: Prisma.UserWhereInput[] = [];

  if (!query) return filters;

  filters.push({ email: { contains: query, mode: 'insensitive' } });
  filters.push({ last_name: { contains: query, mode: 'insensitive' } });
  filters.push({ first_name: { contains: query, mode: 'insensitive' } });

  return filters;
}
