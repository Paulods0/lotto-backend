import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';

export async function getAgent(id: string) {
  const cacheKey = RedisKeys.agents.byId(id);
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const agent = await prisma.agent.findUnique({
    where: { id },
  });

  if (!agent) throw new NotFoundError('Agente não encontrado.');

  await setCache(cacheKey, agent);

  return agent;
}
