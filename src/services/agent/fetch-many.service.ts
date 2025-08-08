import prisma from '../../lib/prisma';
import { AgentStatus, Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyAgents(params: PaginationParams & { status?: AgentStatus }) {
  const cacheKey = RedisKeys.agents.listWithFilters(params);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  let search = buildFilters(params.query);

  const where: Prisma.AgentWhereInput = {
    ...(search.length > 0 ? { OR: search } : {}),
    ...(params.type_id && { type_id: params.type_id }),
    ...(params.city_id && { city_id: params.city_id }),
    ...(params.area_id && { area_id: params.area_id }),
    ...(params.zone_id && { zone_id: params.zone_id }),
    ...(params.province_id && { province_id: params.province_id }),
  };

  const offset = (params.page - 1) * params.limit;

  const agents = await prisma.agent.findMany({
    where,
    take: params.limit,
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
          coordinates: true,
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

function buildFilters(query: string | undefined) {
  let filters: Prisma.AgentWhereInput[] = [];
  const numberValue = Number(query);

  if (!query?.trim()) return filters;

  filters.push(
    { status: { equals: query as AgentStatus } },
    { bi_number: { contains: query, mode: 'insensitive' } },
    { last_name: { contains: query, mode: 'insensitive' } },
    { first_name: { contains: query, mode: 'insensitive' } }
  );

  if (!isNaN(numberValue)) {
    filters.push(
      { phone_number: { equals: numberValue } },
      { afrimoney_number: { equals: numberValue } },
      { id_reference: numberValue }
    );
  }

  return filters;
}
