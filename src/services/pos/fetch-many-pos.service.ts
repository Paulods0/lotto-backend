import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyPosService({ limit = 30, page, query }: PaginationParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query?.trim() ?? 'none';

  const select = {
    id: true,
    id_reference: true,
    latitude: true,
    longitude: true,
    type: true,
    admin: true,
    province: true,
    area: true,
    zone: true,
    city: true,
    agent: {
      select: {
        id: true,
        id_reference: true,
        last_name: true,
      },
    },
  };

  const cacheKey = `pos:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const orderBy: Prisma.PosOrderByWithRelationInput = { created_at: 'asc' };
  let where: Prisma.PosWhereInput | undefined = undefined;

  if (query) {
    const searchConditions: Prisma.PosWhereInput[] = [];

    const numericQuery = Number(query);
    if (!isNaN(numericQuery)) {
      searchConditions.push({ id_reference: numericQuery });
    }

    where = { OR: searchConditions };
  }

  if (typeof page === 'undefined') {
    const pos = await prisma.pos.findMany({ where, orderBy, select });
    await redis.set(cacheKey, JSON.stringify(pos), 'EX', exptime);
    return pos;
  }

  const offset = (DEFAULT_PAGE - 1) * limit;

  const pos = await prisma.pos.findMany({
    where,
    skip: offset,
    take: DEFAULT_LIMIT,
    orderBy,
    select,
  });

  if (pos.length > 0) {
    await redis.set(cacheKey, JSON.stringify(pos), 'EX', exptime);
  }

  return pos;
}
