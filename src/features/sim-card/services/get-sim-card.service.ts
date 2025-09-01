import { AppError, NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { SimCard } from '../@types/sim-card.t';

export async function getSimCardService(id: string): Promise<SimCard> {
  const simCard = await prisma.simCard.findUnique({
    where: {
      id,
    },
    include: { terminal: true },
  });

  if (!simCard) throw new NotFoundError('Sim card não encontrado');

  return simCard;
}
