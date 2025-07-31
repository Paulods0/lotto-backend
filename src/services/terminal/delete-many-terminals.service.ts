import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import z from 'zod';
import { currentUser } from '../../validations/agent-schemas/create-agent-schema';

export async function deleteManyTerminalService(ids: string[]) {
  const deleted = await prisma.terminal.deleteMany({
    where: { id: { in: ids } },
  });

  if (deleted.count === 0) {
    throw new NotFoundError('Nenhum terminal encontrado para remover.');
  }

  try {
    await deleteKeysByPattern('terminals:*');
  } catch (error) {
    console.warn('Erro ao limpar cache', error);
  }

  return deleted.count;
}
