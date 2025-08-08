import prisma from '../../lib/prisma';
import { LicenceStatus, Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/redis/keys';
import { setCache } from '../../utils/redis/set-cache';
import { getCache } from '../../utils/redis/get-cache';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyLicences({ limit, page, query = '', admin_id }: PaginationParams) {
  const cacheKey = RedisKeys.licences.listWithFilters({
    page,
    limit,
    admin_id,
    query: query || 'none',
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const searchFilters = buildFilters(query);

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
      limit: true,
      status: true,
      coordinates: true,
      admin_id: true,
      creation_date: true,
      expires_at: true,
      created_at: true,
      admin: { select: { id: true, name: true } },
    },
  });

  if (licences.length > 0) {
    await setCache(cacheKey, licences);
  }

  return licences;
}

function buildFilters(query: string): Prisma.LicenceWhereInput[] {
  const filters: Prisma.LicenceWhereInput[] = [];

  console.log('Status :', query);

  filters.push({ description: { contains: query, mode: 'insensitive' } });
  filters.push({ number: { contains: query, mode: 'insensitive' } });
  filters.push({ reference: { contains: query, mode: 'insensitive' } });
  filters.push({ coordinates: { contains: query, mode: 'insensitive' } });

  const lowerQuery = query.toLowerCase();

  if (Object.values(LicenceStatus).includes(query.toLowerCase() as LicenceStatus)) {
    filters.push({
      status: { equals: query.toLowerCase() as LicenceStatus },
    });
  }

  const parsedDate = new Date(query);
  if (!isNaN(parsedDate.getTime())) {
    const start = new Date(parsedDate);
    const end = new Date(parsedDate);
    end.setDate(end.getDate() + 1);

    filters.push({
      created_at: {
        gte: start,
        lt: end,
      },
    });
  }

  return filters;
}
