import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyLicencesService({ limit = 30, page, query }: PaginationParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query?.trim() ?? 'none';

  const cacheKey = `licences:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const orderBy: Prisma.LicenceOrderByWithRelationInput = { created_at: 'asc' };
  let where: Prisma.LicenceWhereInput | undefined = undefined;

  if (query) {
    const searchConditions: Prisma.LicenceWhereInput[] = [];

    searchConditions.push({ description: { contains: query, mode: 'insensitive' } });
    searchConditions.push({ number: { contains: query, mode: 'insensitive' } });
    searchConditions.push({ reference: { contains: query, mode: 'insensitive' } });

    where = { OR: searchConditions };
  }

  if (typeof page === 'undefined') {
    const licences = await prisma.licence.findMany({ where, orderBy });
    await redis.set(cacheKey, JSON.stringify(licences), 'EX', exptime);
    return licences;
  }

  const offset = (DEFAULT_PAGE - 1) * limit;

  const licences = await prisma.licence.findMany({
    where,
    skip: offset,
    take: DEFAULT_LIMIT,
    orderBy,
    select: {
      id: true,
      number: true,
      description: true,
      reference: true,
      creation_date: true,
      created_at: true,
      admin: { select: { id:true, name: true } },
    },
  });
  
  if (licences.length > 0) {
    await redis.set(cacheKey, JSON.stringify(licences), 'EX', exptime);
  }

  return licences;
}
