import isUUID from '../../lib/uuid';
import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function getTerminalService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const cacheKey = `terminal:${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

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

  const exttime = 60 * 5;

  await redis.set(cacheKey, JSON.stringify(terminal), 'EX', exttime);
  console.log(cacheKey);

  return terminal;
}
