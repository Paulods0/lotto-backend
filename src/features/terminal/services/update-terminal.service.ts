import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { audit } from '../../../utils/audit-log';
import { RedisKeys } from '../../../utils/redis/keys';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { UpdateTerminalDTO } from '../schemas/update-terminal.schema';
import { TerminalStatus } from '../@types/terminal.t';
import { connectOrDisconnect } from '../../../utils/connect-disconnect';

export async function updateTerminalService({ user, ...data }: UpdateTerminalDTO) {
  await prisma.$transaction(async (tx) => {
    const terminal = await tx.terminal.findUnique({
      where: { id: data.id },
      include: { sim_card: true, agent: true },
    });

    if (!terminal) throw new NotFoundError('Terminal não encontrado');

    if (data.sim_card_id) {
      const simCard = await tx.simCard.findUnique({
        where: { id: data.sim_card_id },
      });

      if (!simCard) {
        throw new NotFoundError('Sim card não encontrado');
      }
    }

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({
        where: { id: data.agent_id },
      });

      if (!agent) {
        throw new NotFoundError('Agent não encontrado');
      }
    }

    const status: TerminalStatus = data.note ? 'broken' : data.sim_card_id ? 'ready' : 'stock';

    const updated = await tx.terminal.update({
      where: { id: data.id },
      data: {
        status,
        note: data.note,
        leaved_at: data.leaved_at,
        ...(data.agent_id && { agent_id: data.agent_id }),
        ...connectOrDisconnect('sim_card', data.sim_card_id),
      },
    });

    await audit(tx, 'UPDATE', {
      user,
      entity: 'TERMINAL',
      before: terminal,
      after: updated,
    });
  });

  const promises = [deleteCache(RedisKeys.terminals.all()), deleteCache(RedisKeys.auditLogs.all())];

  if (data.agent_id) {
    promises.push(deleteCache(RedisKeys.agents.all()));
  }

  await Promise.all(promises);
}
