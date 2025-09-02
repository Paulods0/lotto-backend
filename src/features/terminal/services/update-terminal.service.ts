import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { audit } from '../../../utils/audit-log';
import { RedisKeys } from '../../../utils/redis/keys';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { UpdateTerminalDTO } from '../schemas/update-terminal.schema';

export async function updateTerminalService({ user, ...data }: UpdateTerminalDTO) {
  await prisma.$transaction(async (tx) => {
    const terminal = await tx.terminal.findUnique({
      where: { id: data.id },
    });

    if (!terminal) throw new NotFoundError('Terminal não encontrado');

    const updated = await tx.terminal.update({
      where: { id: data.id },
      data: {
        note: data.note,
        leaved_at: data.leaved_at,
      },
    });

    await audit(tx, 'UPDATE', {
      user,
      entity: 'TERMINAL',
      before: terminal,
      after: updated,
    });

    return updated;
  });

  const promises = [deleteCache(RedisKeys.terminals.all()), deleteCache(RedisKeys.auditLogs.all())];

  if (data.agent_id) {
    promises.push(deleteCache(RedisKeys.agents.all()));
  }

  await Promise.all(promises);
}
