import redis from '../../lib/redis';
import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function deleteTerminalService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const terminal = await prisma.terminal.findUnique({ where: { id } });

  if (!terminal) throw new NotFoundError('Terminal não encontrado.');

  await prisma.terminal.delete({ where: { id } });

  const redisKeys = await redis.keys('terminals:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }
}
