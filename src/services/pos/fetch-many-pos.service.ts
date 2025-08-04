import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { getCache, setCache } from '../../utils/redis';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyPosService({
  limit = 30,
  page = 1,
  query,
  type_id,
  city_id,
  area_id,
  zone_id,
  province_id,
}: PaginationParams & {
  type_id?: number;
  city_id?: number;
  area_id?: number;
  zone_id?: number;
  province_id?: number;
}) {
  const DEFAULT_LIMIT = limit;
  const DEFAULT_PAGE = page;
  const DEFAULT_QUERY = query?.trim() || 'none';

  const select = {
    id: true,
    id_reference: true,
    latitude: true,
    longitude: true,
    type: true,
    subtype: true,
    admin: true,
    province: true,
    area: true,
    zone: true,
    city: true,
    licence: true,
    agent: {
      select: {
        id: true,
        id_reference: true,
        first_name: true,
        last_name: true,
      },
    },
  };

  const where: Prisma.PosWhereInput = {
    ...(type_id && { type_id }),
    ...(city_id && { city_id }),
    ...(area_id && { area_id }),
    ...(zone_id && { zone_id }),
    ...(province_id && { province_id }),
  };

  if (query) {
    const numericQuery = Number(query);
    const searchConditions: Prisma.PosWhereInput[] = [];

    if (!isNaN(numericQuery)) {
      searchConditions.push({ id_reference: numericQuery });
    }

    if (searchConditions.length > 0) {
      where.OR = searchConditions;
    }
  }

  const cacheKey = [
    'pos',
    `limit:${DEFAULT_LIMIT}`,
    `page:${DEFAULT_PAGE}`,
    `query:${DEFAULT_QUERY}`,
    type_id && `type:${type_id}`,
    city_id && `city:${city_id}`,
    area_id && `area:${area_id}`,
    zone_id && `zone:${zone_id}`,
    province_id && `province:${province_id}`,
  ]
    .filter(Boolean)
    .join(':');

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const orderBy: Prisma.PosOrderByWithRelationInput = { created_at: 'asc' };

  const offset = (DEFAULT_PAGE - 1) * DEFAULT_LIMIT;

  const pos = await prisma.pos.findMany({
    where,
    skip: offset,
    take: DEFAULT_LIMIT,
    orderBy,
    select,
  });

  if (pos.length > 0) {
    await setCache(cacheKey, pos);
  }

  return pos;
}
