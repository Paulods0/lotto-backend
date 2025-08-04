import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyAgentsService(params: PaginationParams) {
  const { limit, page, query = '', area_id, city_id, province_id, status, type_id, zone_id } = params;

  const cacheKey = RedisKeys.agents.listWithFilters({
    limit,
    page,
    query: query || 'none',
    area_id,
    city_id,
    province_id,
    status,
    type_id,
    zone_id,
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  let search = buildAgentsFilter(query);

  const where: Prisma.AgentWhereInput = {
    ...(search.length > 0 ? { OR: search } : {}),
    ...(typeof status !== 'undefined' ? { status } : {}),
    ...(typeof type_id !== 'undefined' ? { type_id } : {}),
    ...(typeof city_id !== 'undefined' ? { city_id } : {}),
    ...(typeof area_id !== 'undefined' ? { area_id } : {}),
    ...(typeof zone_id !== 'undefined' ? { zone_id } : {}),
    ...(typeof province_id !== 'undefined' ? { province_id } : {}),
  };

  const offset = (page - 1) * limit;

  const agents = await prisma.agent.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
    select: {
      id: true,
      genre: true,
      status: true,
      terminal: true,
      last_name: true,
      first_name: true,
      id_reference: true,
      phone_number: true,
      afrimoney_number: true,
      area: { select: { id: true, name: true } },
      zone: { select: { id: true, number: true } },
      city: { select: { id: true, name: true } },
      province: { select: { id: true, name: true } },
      pos: {
        select: {
          latitude: true,
          longitude: true,
          area: true,
          zone: true,
          type: true,
          subtype: true,
        },
      },
    },
  });

  if (agents.length > 0) {
    await setCache(cacheKey, agents);
  }

  return agents;
}

function buildAgentsFilter(query: string | undefined) {
  let search: Prisma.AgentWhereInput[] = [];

  if (!query?.trim()) return search;

  search.push(
    { first_name: { contains: query, mode: 'insensitive' } },
    { last_name: { contains: query, mode: 'insensitive' } },
    { bi_number: { contains: query, mode: 'insensitive' } }
  );

  const numberValue = Number(query);
  if (!isNaN(numberValue)) {
    search.push(
      { phone_number: { equals: numberValue } },
      { afrimoney_number: { equals: numberValue } },
      { id_reference: numberValue }
    );
  }

  return search;
}
