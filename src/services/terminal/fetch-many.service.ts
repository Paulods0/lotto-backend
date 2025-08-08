import prisma from '../../lib/prisma';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';
import { Prisma, TerminalStatus } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyTerminals(params: PaginationParams) {
  const cacheKey = RedisKeys.terminals.listWithFilters(params);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const filters = buildFilters(params.query);

  const where: Prisma.TerminalWhereInput = {
    ...(filters.length > 0 ? { OR: filters } : {}),
    ...(params.area_id && { area_id: params.area_id }),
    ...(params.zone_id && { zone_id: params.zone_id }),
    ...(params.city_id && { city_id: params.city_id }),
    ...(params.agent_id && { agent_id: params.agent_id }),
    ...(params.province_id && { province_id: params.province_id }),
  };

  const offset = (params.page - 1) * params.limit;

  const terminals = await prisma.terminal.findMany({
    where,
    take: params.limit,
    skip: offset,
    orderBy: { created_at: 'asc' },
    include: {
      city: true,
      area: true,
      zone: true,
      province: true,
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
    await setCache(cacheKey, terminals);
  }

  return terminals;
}

function buildFilters(query: string): Prisma.TerminalWhereInput[] {
  const filters: Prisma.TerminalWhereInput[] = [];

  if (!query) return filters;

  const numericQuery = Number(query);
  const isNumeric = !isNaN(numericQuery);

  filters.push({ serial: { contains: query, mode: 'insensitive' } });
  filters.push({ device_id: { contains: query, mode: 'insensitive' } });

  if (Object.values(TerminalStatus).includes(query as TerminalStatus)) {
    filters.push({ status: { equals: query as TerminalStatus } });
  }

  if (isNumeric) {
    filters.push(
      { pin: numericQuery },
      { puk: numericQuery },
      { sim_card: numericQuery },
      { id_reference: numericQuery }
    );
  }

  const parsedDate = new Date(query);

  if (!isNaN(parsedDate.getTime())) {
    const start = new Date(parsedDate);
    const end = new Date(parsedDate);
    end.setDate(end.getDate() + 1);

    filters.push({
      delivery_date: {
        gte: start,
        lt: end,
      },
    });
  }

  return filters;
}
