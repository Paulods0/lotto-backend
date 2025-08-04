import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { getCache, setCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function getAgentService(id: string) {
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
