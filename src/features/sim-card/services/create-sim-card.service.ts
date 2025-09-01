import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { connectIfDefined } from '../../../utils/connect-disconnect';
import { CreateSimCardDTO } from '../schemas/create-sim-card.schema';

export async function createSimCardService({ user, ...data }: CreateSimCardDTO): Promise<{ id: string }> {
  return await prisma.$transaction(async (tx) => {
    const simCard = await tx.simCard.create({
      data: {
        ...data,
        ...connectIfDefined('terminal_id', data.terminal_id),
      },
    });

    await audit(tx, 'CREATE', {
      entity: 'SIM_CARD',
      user: user,
      after: simCard,
      before: null,
    });

    return { id: simCard.id };
  });
}
