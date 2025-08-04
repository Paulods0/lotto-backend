import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { getCache, setCache } from '../../utils/redis';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyTerminalsService(params: PaginationParams) {
  const { limit, page, query = '', area_id, city_id, province_id, zone_id } = params;

  const cacheKey = RedisKeys.terminals.listWithFilters({
    limit,
    page,
    query: query || 'none',
    area_id,
    zone_id,
    province_id,
    city_id,
  });

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const searchFilters = buildSearchFilters(query);

  const where: Prisma.TerminalWhereInput = {
    ...(searchFilters.length > 0 ? { OR: searchFilters } : {}),
    ...(area_id && { area_id }),
    ...(zone_id && { zone_id }),
    ...(city_id && { city_id }),
    ...(province_id && { province_id }),
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

  const numericQuery = Number(query);
  const isNumeric = !isNaN(numericQuery);

  // Pesquisa por serial, sim_card e id_reference como string ou número
  filters.push({ serial: { contains: query, mode: 'insensitive' } });

  // Caso seja um número, adiciona correspondência exata
  if (isNumeric) {
    filters.push(
      { pin: numericQuery },
      { puk: numericQuery },
      { sim_card: numericQuery },
      { id_reference: numericQuery }
    );
  }

  // Filtro por status booleano
  if (query === 'true' || query === 'false') {
    filters.push({ status: query === 'true' });
  }

  return filters;
}
