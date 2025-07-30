import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';

export async function deleteManyTerminalService(ids: string[]) {
  const deleted = await prisma.terminal.deleteMany({
    where: { id: { in: ids } },
  });

  if (deleted.count === 0) {
    throw new NotFoundError('Nenhum terminal encontrado para remover.');
  }

  const redisKeys = await redis.keys('terminals:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }

  return deleted.count;
}
