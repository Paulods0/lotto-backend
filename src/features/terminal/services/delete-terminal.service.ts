import { AuthPayload } from '../../../@types/auth-payload';
import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';

export async function deleteTerminalService(id: string, user: AuthPayload) {
  await prisma.$transaction(async (tx) => {
    const existingTerminal = await tx.terminal.findUnique({ where: { id } });

    if (!existingTerminal) throw new NotFoundError('Terminal não encontrado.');

    await tx.terminal.delete({ where: { id } });

    await audit(tx, 'DELETE', {
      entity: 'TERMINAL',
      user,
      before: existingTerminal,
      after: null,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
    deleteCache(RedisKeys.agents.all()),
  ]);
}
