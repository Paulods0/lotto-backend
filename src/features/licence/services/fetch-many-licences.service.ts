import { Prisma, LicenceStatus } from '@prisma/client';
import { PaginationParams } from '../../../@types/pagination-params';
import prisma from '../../../lib/prisma';
import { getCache } from '../../../utils/redis/get-cache';
import { RedisKeys } from '../../../utils/redis/keys';
import { setCache } from '../../../utils/redis/set-cache';

export async function fetchManyLicences(params: PaginationParams) {
  const cacheKey = RedisKeys.licences.listWithFilters(params);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const searchFilters = buildFilters(params.query);

  const where: Prisma.LicenceWhereInput = {
    ...(searchFilters.length ? { OR: searchFilters } : {}),
    ...(params.admin_id && { admin_id: params.admin_id }),
    ...(params.status && { status: params.status as LicenceStatus }),
  };

  const offset = (params.page - 1) * params.limit;

  const licences = await prisma.licence.findMany({
    where,
    skip: offset,
    take: params.limit,
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

  filters.push({ number: { contains: query, mode: 'insensitive' } });
  filters.push({ reference: { contains: query, mode: 'insensitive' } });
  filters.push({ coordinates: { contains: query, mode: 'insensitive' } });
  filters.push({ description: { contains: query, mode: 'insensitive' } });

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
      creation_date: {
        gte: start,
        lt: end,
      },
    });
  }

  return filters;
}
