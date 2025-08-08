import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { deleteCache } from '../../utils/redis/delete-cache';

export async function deleteTerminal(id: string, user: AuthPayload) {
  await prisma.$transaction(async tx => {
    const existingTerminal = await tx.terminal.findUnique({ where: { id } });

    if (!existingTerminal) throw new NotFoundError('Terminal não encontrado.');

    await tx.terminal.delete({ where: { id } });

    await audit(tx, 'delete', {
      entity: 'terminal',
      user,
      before: null,
      after: existingTerminal,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
    deleteCache(RedisKeys.agents.all()),
  ]);
}
