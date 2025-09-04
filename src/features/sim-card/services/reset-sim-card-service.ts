import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { RedisKeys } from '../../../utils/redis';

export async function resetSimCardService(id: string) {
  await prisma.$transaction(async tx => {
    const simCard = await tx.simCard.findUnique({
      where: {
        id,
      },
    });

    if (!simCard) {
      throw new NotFoundError('Sim card não encontrado ');
    }

    await tx.simCard.update({
      where: {
        id: simCard.id,
      },
      data: {
        terminal: { disconnect: true },
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
