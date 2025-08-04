import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { getCache, setCache } from '../../utils/redis';
import { PaginationParams } from '../../@types/pagination-params';

export interface ExtendedParams extends PaginationParams {
  area_id?: number;
  zone_id?: number;
  province_id?: number;
  city_id?: number;
  agent_id?: string;
}

export async function fetchManyTerminalsService(params: ExtendedParams) {
  const { limit, page, query = '', area_id, city_id, province_id, zone_id, agent_id } = params;

  const cacheKey = RedisKeys.terminals.listWithFilters({
    limit,
    page,
    query: query || 'none',
    area_id,
    zone_id,
    province_id,
    city_id,
    agent_id,
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const searchFilters = buildSearchFilters(query);

  const where: Prisma.TerminalWhereInput = {
    ...(searchFilters.length ? { OR: searchFilters } : {}),
    ...(area_id && { area_id }),
    ...(zone_id && { zone_id }),
    ...(city_id && { city_id }),
    ...(province_id && { province_id }),
    ...(agent_id && { agent_id }),
  };

  const offset = (page - 1) * limit;

  const terminals = await prisma.terminal.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
    select: {
      id: true,
      pin: true,
      puk: true,
      serial: true,
      status: true,
      sim_card: true,
      id_reference: true,
      city: { select: { id: true, name: true } },
      area: { select: { id: true, name: true } },
      zone: { select: { id: true, number: true } },
      province: { select: { id: true, name: true } },
      agent: {
        select: {
          id: true,
          id_reference: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  // Cache apenas se houver resultados
  if (terminals.length > 0) {
    await setCache(cacheKey, terminals);
  }

  return terminals;
}

function buildSearchFilters(query: string): Prisma.TerminalWhereInput[] {
  const filters: Prisma.TerminalWhereInput[] = [];

  if (!query) return filters;

  filters.push({ serial: { contains: query, mode: 'insensitive' } });

  if (query === 'true' || query === 'false') {
    filters.push({ status: query === 'true' });
  }

  const numericQuery = Number(query);

  if (!isNaN(numericQuery)) {
    filters.push({ pin: numericQuery });
    filters.push({ puk: numericQuery });
    filters.push({ sim_card: numericQuery });
    filters.push({ id_reference: numericQuery });
  }

  return filters;
}
