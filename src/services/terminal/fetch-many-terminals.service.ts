import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';

interface ExtendedParams extends PaginationParams {
  area_id?: number;
  zone_id?: number;
  province_id?: number;
  city_id?: number;
  agent_id?: string; // Corrigido aqui
}

export async function fetchManyTerminalsService({
  limit = 30,
  page,
  query,
  area_id,
  city_id,
  province_id,
  zone_id,
  agent_id,
}: ExtendedParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query?.trim() ?? 'none';

  const cacheKey = `terminals:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}:area:${area_id}:zone:${zone_id}:province:${province_id}:city:${city_id}:agent:${agent_id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const orderBy: Prisma.TerminalOrderByWithRelationInput = { created_at: 'asc' };
  const searchConditions: Prisma.TerminalWhereInput[] = [];

  if (query) {
    searchConditions.push({ serial: { contains: query, mode: 'insensitive' } });

    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery === 'true' || lowerCaseQuery === 'false') {
      searchConditions.push({ status: lowerCaseQuery === 'true' });
    }

    const numericQuery = Number(query);
    if (!isNaN(numericQuery)) {
      searchConditions.push({ pin: numericQuery });
      searchConditions.push({ puk: numericQuery });
      searchConditions.push({ sim_card: numericQuery });
      searchConditions.push({ id_reference: numericQuery });
    }
  }

  let where: Prisma.TerminalWhereInput = {
    ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
  };

  // Filtros diretos
  if (area_id) where.area_id = area_id;
  if (zone_id) where.zone_id = zone_id;
  if (province_id) where.province_id = province_id;
  if (city_id) where.city_id = city_id;

  // Filtro herdado do agent_id, substitui os outros se for usado
  if (agent_id) {
    const agent = await prisma.agent.findUnique({
      where: { id: agent_id },
      select: {
        area_id: true,
        zone_id: true,
        province_id: true,
        city_id: true,
      },
    });

    if (agent) {
      where.area_id = agent.area_id ?? undefined;
      where.zone_id = agent.zone_id ?? undefined;
      where.province_id = agent.province_id ?? undefined;
      where.city_id = agent.city_id ?? undefined;
    }
  }

  const offset = (DEFAULT_PAGE - 1) * DEFAULT_LIMIT;

  const terminals = await prisma.terminal.findMany({
    where,
    skip: offset,
    take: DEFAULT_LIMIT,
    orderBy,
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

  if (terminals.length > 0) {
    await redis.set(cacheKey, JSON.stringify(terminals), 'EX', exptime);
  }

  return terminals;
}
