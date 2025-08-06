import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { getCache } from '../../utils/redis/get-cache';
import { RedisKeys } from '../../utils/redis/keys';
import { PaginationParams } from '../../@types/pagination-params';
import { setCache } from '../../utils/redis/set-cache';

export async function fetchManyUsers({ limit, page, query }: PaginationParams) {
  const cacheKey = RedisKeys.users.listWithFilters({
    page,
    limit,
    query: 'none',
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const search = buildUserFilter(query);

  let where: Prisma.UserWhereInput | undefined = {
    AND: [{ OR: search }, { role: { in: ['area_manager', 'dev', 'super_admin', 'supervisor'] } }],
  };

  const offset = (page - 1) * limit;

  const users = await prisma.user.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
  });

  if (users.length > 0) await setCache(cacheKey, users);

  return users;
}

function buildUserFilter(query: string | undefined) {
  let filters: Prisma.UserWhereInput[] = [];
  if (query) {
    filters.push({ first_name: { contains: query, mode: 'insensitive' } });
    filters.push({ last_name: { contains: query, mode: 'insensitive' } });
    filters.push({ email: { contains: query, mode: 'insensitive' } });
  }
  return filters;
}
