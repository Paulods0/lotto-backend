import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';

export async function fetchManyTerminalsService({ limit = 30, page, query }: PaginationParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query?.trim() ?? 'none';

  const cacheKey = `terminals:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const orderBy: Prisma.TerminalOrderByWithRelationInput = { created_at: 'asc' };
  let where: Prisma.TerminalWhereInput | undefined = undefined;

  if (query) {
    const searchConditions: Prisma.TerminalWhereInput[] = [];

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

    where = { OR: searchConditions };
  }

  if (typeof page === 'undefined') {
    const terminals = await prisma.terminal.findMany({ where, orderBy });
    await redis.set(cacheKey, JSON.stringify(terminals), 'EX', exptime);
    return terminals;
  }

  const offset = (DEFAULT_PAGE - 1) * limit;

  const terminals = await prisma.terminal.findMany({
    where,
    skip: offset,
    take: DEFAULT_LIMIT,
    orderBy,
    select: {
      id: true,
      id_reference: true,
      pin: true,
      puk: true,
      serial: true,
      sim_card: true,
      status: true,
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
