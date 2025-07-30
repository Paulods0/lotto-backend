import isUUID from '../../lib/uuid';
import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function getPosService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const cacheKey = `pos:${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) throw new NotFoundError('Pos não encontrado.');

  const exttime = 60 * 5;

  await redis.set(cacheKey, JSON.stringify(pos), 'EX', exttime);

  return pos;
}
