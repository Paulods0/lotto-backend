import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';
import { InternalServerError } from '../../errors';

export async function fetchManyAgentsService({ limit = 30, page, query }: PaginationParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query ?? 'none';

  const cacheKey = `agents:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }

  const orderBy: Prisma.AgentOrderByWithRelationInput = { created_at: 'asc' };
  let where: Prisma.AgentWhereInput | undefined = undefined;

  if (query) {
    const searchConditions: Prisma.AgentWhereInput[] = [];

    searchConditions.push({
      first_name: {
        contains: query,
        mode: 'insensitive',
      },
    });

    searchConditions.push({
      last_name: {
        contains: query,
        mode: 'insensitive',
      },
    });

    const id = Number(query);
    if (!isNaN(id)) {
      searchConditions.push({
        id_reference: id,
      });
    }

    where = { OR: searchConditions };
  }

  if (typeof page === 'undefined') {
    const agents = await prisma.agent.findMany({ where, orderBy });
    await redis.set(cacheKey, JSON.stringify(agents), 'EX', exptime);
    return agents;
  }

  const offset = (page - 1) * limit;

  const agents = await prisma.agent.findMany({
    where,
    skip: offset,
    take: limit,
    orderBy,
  });

  if (agents.length > 0) {
    await redis.set(cacheKey, JSON.stringify(agents), 'EX', exptime);
  }

  return agents;
}
