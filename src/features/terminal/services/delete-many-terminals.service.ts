import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';

export async function deleteManyTerminalService(ids: string[]) {
  const deleted = await prisma.terminal.deleteMany({
    where: { id: { in: ids } },
  });

  if (deleted.count === 0) {
    throw new NotFoundError('Nenhum terminal encontrado para remover.');
  }

  await Promise.all([deleteCache(RedisKeys.terminals.all()), deleteCache(RedisKeys.agents.all())]);

  return deleted.count;
}
