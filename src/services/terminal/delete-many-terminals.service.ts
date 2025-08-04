import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function deleteManyTerminalService(ids: string[]) {
  const deleted = await prisma.terminal.deleteMany({
    where: { id: { in: ids } },
  });

  if (deleted.count === 0) {
    throw new NotFoundError('Nenhum terminal encontrado para remover.');
  }

  await deleteCache(RedisKeys.terminals.all());
  await deleteCache(RedisKeys.agents.all());

  return deleted.count;
}
