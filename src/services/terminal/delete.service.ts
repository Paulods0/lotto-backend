import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis/delete-cache';
import { RedisKeys } from '../../utils/redis/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLog } from '../audit-log/create.service';

export async function deleteTerminal(id: string, user: AuthPayload) {
  const existingTerminal = await prisma.terminal.findUnique({ where: { id } });

  if (!existingTerminal) throw new NotFoundError('Terminal não encontrado.');

  const deletedTerminal = await prisma.$transaction(async (tx) => {
    const { id: idTerminal, created_at, ...terminalDeleted } = await tx.terminal.delete({ where: { id } });

    await createAuditLog(tx, {
      action: 'DELETE',
      entity: 'TERMINAL',
      user_id: user.id,
      user_name: user.name,
      entity_id: id,
      metadata: terminalDeleted as Record<string, any>, // Aqui passamos os dados deletados
    });

    return terminalDeleted;
  });

  await Promise.all([
    deleteCache(RedisKeys.terminals.all()),
    await deleteCache(RedisKeys.auditLogs.all()),
    deleteCache(RedisKeys.agents.all()),
  ]);

  return deletedTerminal;
}
