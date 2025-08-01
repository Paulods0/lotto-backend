import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../@types/pagination-params';
import { AgentStatus } from '../../validations/agent-schemas/create-agent-schema';

export type AgentQueryParams = {
  type_id?: number;
  city_id?: number;
  area_id?: number;
  zone_id?: number;
  province_id?: number;
  status?: AgentStatus;
};

export async function fetchManyAgentsService({
  limit = 30,
  page,
  query,
  area_id,
  city_id,
  province_id,
  status,
  type_id,
  zone_id,
}: PaginationParams & AgentQueryParams) {
  const exptime = 60 * 5;

  const DEFAULT_LIMIT = limit ?? 30;
  const DEFAULT_PAGE = page ?? 1;
  const DEFAULT_QUERY = query ?? 'none';

  const cacheKey = `agents:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}:type:${type_id}:area:${area_id}:zone:${zone_id}:status:${status}:city:${city_id}:province:${province_id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const orderBy: Prisma.AgentOrderByWithRelationInput = { created_at: 'asc' };

  const searchConditions: Prisma.AgentWhereInput[] = [];

  if (query) {
    searchConditions.push(
      {
        first_name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        last_name: {
          contains: query,
          mode: 'insensitive',
        },
      }
    );

    const id = Number(query);
    if (!isNaN(id)) {
      searchConditions.push({
        id_reference: id,
      });
    }
  }

  const where: Prisma.AgentWhereInput = {
    ...(searchConditions.length > 0 && { OR: searchConditions }),
    ...(type_id && { type_id }),
    ...(area_id && { area_id }),
    ...(zone_id && { zone_id }),
    ...(status && { status }),
    ...(city_id && { city_id }),
    ...(province_id && { province_id }),
  };

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
        select:{ 
          latitude:true, 
          longitude:true,
          area:true,
          zone:true,
          type:true,
          subtype:true,
        } 
      },
    },
  });

  if (agents.length > 0) {
    await redis.set(cacheKey, JSON.stringify(agents), 'EX', exptime);
  }

  return agents;
}
