import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { RedisKeys, getCache, setCache } from '../../../utils/redis/';

export async function getTerminalService(id: string) {
  const cacheKey = RedisKeys.terminals.byId(id);

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const terminal = await prisma.terminal.findUnique({
    where: { id },
    omit: {
      area_id: true,
      zone_id: true,
      province_id: true,
      city_id: true,
      agent_id: true,
    },
    include: {
      province: true,
      city: true,
      area: {
        include: {
          zones: true,
        },
      },
      sim_card: {
        select: {
          number: true,
          pin: true,
          puk: true,
        },
      },
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

  if (!terminal) throw new NotFoundError('Terminal não encontrado');

  await setCache(cacheKey, terminal);

  return terminal;
}
