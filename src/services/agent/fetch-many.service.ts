import prisma from '../../lib/prisma';
import { RedisKeys } from '../../utils/redis/keys';
import { AgentStatus, Prisma } from '@prisma/client';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyAgents(params: PaginationParams) {
  const cacheKey = RedisKeys.agents.listWithFilters(params);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  let search = buildFilters(params.query);

  let start: Date | undefined;
  let end: Date | undefined;
  let isValidDate: boolean = false;

  if (params.training_date) {
    const parsedDate = new Date(params.training_date);
    isValidDate = !isNaN(parsedDate.getTime());

    if (isValidDate) {
      start = new Date(parsedDate);
      end = new Date(parsedDate);
      end.setDate(end.getDate() + 1);
    }
  }

  const where: Prisma.AgentWhereInput = {
    ...(search.length > 0 ? { OR: search } : {}),
    ...(params.type_id && { type_id: params.type_id }),
    ...(params.city_id && { city_id: params.city_id }),
    ...(params.area_id && { area_id: params.area_id }),
    ...(params.zone_id && { zone_id: params.zone_id }),
    ...(params.status && { status: params.status as AgentStatus }),
    ...(params.province_id && { province_id: params.province_id }),
    training_date: {
      gte: start,
      lt: end,
    },
  };

  const offset = (params.page - 1) * params.limit;

  const agents = await prisma.agent.findMany({
    where,
    take: params.limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
    include: {
      terminal: true,
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

  if (Object.values(AgentStatus).includes(query.toLowerCase() as AgentStatus)) {
    filters.push({
      status: { equals: query.toLowerCase() as AgentStatus },
    });
  }

  filters.push(
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
