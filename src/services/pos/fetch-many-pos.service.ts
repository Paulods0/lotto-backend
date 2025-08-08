import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyPos(params: PaginationParams) {
  const cacheKey = RedisKeys.pos.listWithFilters(params);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const filters = buildFilters(params.query);

  const where: Prisma.PosWhereInput = {
    ...(filters?.length ? { OR: filters } : {}),
    ...(params.type_id && { type_id: params.type_id }),
    ...(params.city_id && { city_id: params.city_id }),
    ...(params.area_id && { area_id: params.area_id }),
    ...(params.zone_id && { zone_id: params.zone_id }),
    ...(params.subtype_id && { type_id: params.subtype_id }),
    ...(params.subtype_id && { subtype_id: params.subtype_id }),
    ...(params.province_id && { province_id: params.province_id }),
  };

  const offset = (params.page - 1) * params.limit;

  const pos = await prisma.pos.findMany({
    where,
    skip: offset,
    take: params.limit,
    orderBy: { created_at: 'asc' },
    select: {
      id: true,
      id_reference: true,
      coordinates: true,
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
          terminal: { select: { id: true, serial: true } },
        },
      },
    },
  });

  if (pos.length > 0) {
    await setCache(cacheKey, pos);
  }

  return pos;
}

function buildFilters(query: string | undefined) {
  const filters: Prisma.PosWhereInput[] = [];
  const numericQuery = Number(query);

  if (!query?.trim()) return filters;

  filters.push({
    coordinates: { contains: query },
  });

  if (!isNaN(numericQuery)) {
    filters.push({ id_reference: numericQuery });
  }

  return filters;
}
