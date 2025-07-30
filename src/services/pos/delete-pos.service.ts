import redis from '../../lib/redis';
import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function deletePosService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) throw new NotFoundError('Pos não encontrado.');

  await prisma.pos.delete({ where: { id } });

  const redisKeys = await redis.keys('pos:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }
}
