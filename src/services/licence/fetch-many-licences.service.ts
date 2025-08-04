import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyLicencesService({ limit, page, query = '', admin_id }: PaginationParams) {
  const cacheKey = RedisKeys.licences.listWithFilters({
    page,
    limit,
    admin_id,
    query: query || 'none',
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const searchFilters = buildSearchFilters(query);

  const where: Prisma.LicenceWhereInput = {
    ...(searchFilters.length ? { OR: searchFilters } : {}),
    ...(admin_id && { admin_id }),
  };

  const offset = (page - 1) * limit;

  const licences = await prisma.licence.findMany({
    where,
    skip: offset,
    take: limit,
    orderBy: { created_at: 'asc' },
    select: {
      id: true,
      number: true,
      description: true,
      reference: true,
      creation_date: true,
      created_at: true,
      admin: { select: { id: true, name: true } },
    },
  });

  if (licences.length > 0) {
    await setCache(cacheKey, licences);
  }

  return licences;
}

function buildSearchFilters(query: string): Prisma.LicenceWhereInput[] {
  const filters: Prisma.LicenceWhereInput[] = [];

  filters.push({ description: { contains: query, mode: 'insensitive' } });
  filters.push({ number: { contains: query, mode: 'insensitive' } });
  filters.push({ reference: { contains: query, mode: 'insensitive' } });

  return filters;
}
