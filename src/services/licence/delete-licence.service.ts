import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';

export async function deleteLicenceService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const licence = await prisma.licence.findUnique({ where: { id } });

  if (!licence) throw new NotFoundError('Licença não encontrada.');

  await prisma.licence.delete({ where: { id } });

  try {
    await deleteKeysByPattern('licences:*');
  } catch (error) {
    console.warn('Erro ao limpar o redis ', error);
  }
}
