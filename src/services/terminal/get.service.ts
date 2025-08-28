import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { getCache } from '../../utils/redis/get-cache';
import { setCache } from '../../utils/redis/set-cache';

export async function getTerminal(id: string) {
  const cacheKey = RedisKeys.terminals.byId(id);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const terminal = await prisma.terminal.findUnique({
    where: { id },
    include: {
      sim_card: true,
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

  if (!terminal) throw new NotFoundError('Terminal não encontrado.');

  await setCache(cacheKey, terminal);

  return terminal;
}
