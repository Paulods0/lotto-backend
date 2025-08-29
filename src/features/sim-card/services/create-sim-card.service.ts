import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { CreateSimCardDTO } from '../schemas/create-sim-card.schema';

export async function createSimCardService(input: CreateSimCardDTO) {
  await prisma.$transaction(async (tx) => {
    const simCard = await tx.simCard.create({
      data: {
        ...input,
        terminal_id: input.terminal_id,
      },
    });

    await audit(tx, 'CREATE', {
      entity: 'SIM_CARD',
      user: input.user,
      after: simCard,
      before: null,
    });

    return simCard.id;
  });
}
