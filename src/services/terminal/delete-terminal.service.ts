import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLogService } from '../audit-log/create-audit-log-service';

export async function deleteTerminalService(id: string, user: AuthPayload) {
  const existingTerminal = await prisma.terminal.findUnique({ where: { id } });

  if (!existingTerminal) throw new NotFoundError('Terminal não encontrado.');

  const deletedTerminal = await prisma.$transaction(async tx => {
    const { id: idTerminal, created_at, ...terminalDeleted } = await tx.terminal.delete({ where: { id } });

    await createAuditLogService(tx, {
      action: 'DELETE',
      entity: 'TERMINAL',
      user_id: user.id,
      user_name: user.name,
      entity_id: id,
      metadata: terminalDeleted as Record<string, any>, // Aqui passamos os dados deletados
    });

    return terminalDeleted;
  });

  await Promise.all([deleteCache(RedisKeys.terminals.all()), deleteCache(RedisKeys.agents.all())]);

  return deletedTerminal;
}
