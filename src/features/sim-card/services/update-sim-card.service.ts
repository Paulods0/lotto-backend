import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { connectOrDisconnect } from '../../../utils/connect-disconnect';
import { SimCard } from '../@types/sim-card.t';
import { UpdateSimCardDTO } from '../schemas/update-sim-card.schema';

export async function updateSimCardService({ user, ...data }: UpdateSimCardDTO): Promise<SimCard> {
  return await prisma.$transaction(async (tx) => {
    const simCard = await tx.simCard.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        // ...connectOrDisconnect('terminal_id', data.terminal_id),
      },
    });

    await audit(tx, 'UPDATE', {
      entity: 'SIM_CARD',
      user: user,
      after: simCard,
      before: null,
    });

    return simCard;
  });
}
