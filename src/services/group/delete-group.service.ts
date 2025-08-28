import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';

export async function deleteGroupService(id: string) {
  const numericId = Number(id);
  const group = await prisma.group.findUnique({ where: { id: numericId } });

  if (!group) throw new NotFoundError('Grupo não encontrado.');

  await prisma.group.delete({
    where: {
      id: numericId,
    },
  });
}
