import prisma from '../../lib/prisma';
import { audit } from '../../utils/audit-log';
import { CreateSimCardDTO } from '../../validations/sim-card/create-sim-card.schema';

export async function createSimCardService(input: CreateSimCardDTO) {
  await prisma.$transaction(async tx => {
    const simCard = await tx.simCard.create({
      data: {
        ...input,
        terminal_id: input.terminal_id,
      },
    });

    await audit(tx, 'create', {
      entity: 'sim_card',
      user: input.user,
      after: simCard,
      before: null,
    });

    return simCard.id;
  });
}
