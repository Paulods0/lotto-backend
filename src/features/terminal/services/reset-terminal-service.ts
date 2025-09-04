import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { RedisKeys } from '../../../utils/redis';

export async function resetTerminalService(id: string) {
  await prisma.$transaction(async tx => {
    const terminal = await tx.terminal.findUnique({
      where: {
        id,
      },
    });

    if (!terminal) {
      throw new NotFoundError('Terminal não encontrado ');
    }

    await tx.terminal.update({
      where: {
        id: terminal.id,
      },
      data: {
        agent: { disconnect: true },
        sim_card: { disconnect: true },
      },
    });
  });

  await Promise.all([
    RedisKeys.pos.all(),
    RedisKeys.agents.all(),
    RedisKeys.terminals.all(),
    RedisKeys.auditLogs.all(),
    //TODO: clear sim card cache
  ]);
}
