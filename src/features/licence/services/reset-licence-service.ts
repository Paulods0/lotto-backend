import prisma from '../../../lib/prisma';
import { NotFoundError } from '../../../errors';
import { RedisKeys } from '../../../utils/redis';

export async function resetLicenceService(id: string) {
  await prisma.$transaction(async tx => {
    const licence = await tx.licence.findUnique({
      where: {
        id,
      },
      include: {
        pos: true,
      },
    });

    if (!licence) {
      throw new NotFoundError('Licença não encontrada');
    }

    await tx.licence.update({
      where: {
        id: licence.id,
      },
      data: {
        admin: { disconnect: true },
      },
    });
  });

  await Promise.all([
    RedisKeys.pos.all(),
    RedisKeys.agents.all(),
    RedisKeys.terminals.all(),
    RedisKeys.auditLogs.all(),
  ]);
}
