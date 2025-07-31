import z from 'zod';
import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { BadRequestError, NotFoundError } from '../../errors';
import { currentUser } from './../../validations/agent-schemas/create-agent-schema';

export async function deletePosService(id: string, data: { user: z.infer<typeof currentUser> }) {
  if (!isUUID(id)) {
    throw new BadRequestError('O ID fornecido não é um UUID válido.');
  }

  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) {
    throw new NotFoundError(`POS com o ID ${id} não foi encontrado.`);
  }

  await prisma.pos.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      entity_id: id,
      action: 'delete',
      entity: 'pos',
      metadata: {
        data: pos,
      },
      user_id: data.user.id,
      user_name: data.user.name,
    },
  });

  try {
    await deleteKeysByPattern('pos:*');
  } catch (error) {
    console.warn(`[Redis] Falha ao limpar o cache para padrão "pos:*":`, error);
  }
}
