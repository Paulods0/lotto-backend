import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { getCache, setCache } from '../../utils/redis';

export async function getTerminalService(id: string) {
  const cacheKey = RedisKeys.terminals.byId(id);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const terminal = await prisma.terminal.findUnique({
    where: { id },
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

  if (!terminal) throw new NotFoundError('Terminal não encontrado.');

  await setCache(cacheKey, terminal);

  return terminal;
}
