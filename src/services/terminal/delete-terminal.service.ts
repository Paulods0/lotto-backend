import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function deleteTerminalService(id: string) {
  const terminal = await prisma.terminal.findUnique({ where: { id } });

  if (!terminal) throw new NotFoundError('Terminal não encontrado.');

  await prisma.terminal.delete({ where: { id } });

  await deleteCache(RedisKeys.terminals.all());
  await deleteCache(RedisKeys.agents.all());
}
