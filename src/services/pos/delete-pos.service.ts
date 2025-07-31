import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';

export async function deletePosService(id: string) {
  if (!isUUID(id)) {
    throw new BadRequestError('O ID fornecido não é um UUID válido.');
  }

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) {
    throw new NotFoundError(`POS com o ID ${id} não foi encontrado.`);
  }

  await prisma.pos.delete({ where: { id } });

  try {
    await deleteKeysByPattern('pos:*');
  } catch (error) {
    console.warn(`[Redis] Falha ao limpar o cache para padrão "pos:*":`, error);
  }
}
