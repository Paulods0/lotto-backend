import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import { EditUserDTO } from '../../validations/user/edit-user-schema';

export async function editUserService(data: EditUserDTO) {
  const existingUser = await prisma.user.findUnique({ where: { id: data.id } });

  if (!existingUser) {
    throw new NotFoundError('Usuário não encontrado.');
  }

  const updatedUser = await prisma.user.update({
    where: { id: data.id },
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
    },
  });

 await prisma.auditLog.create({
      data: {
        entity_id: data.id,
        action: 'update',
        entity: 'user',
        metadata: {
        old:data,
        new:updatedUser,
      },
      user_id: data.user.id,
      user_name: data.user.name,
    },
  });     

  try {
    await deleteKeysByPattern('users:*');
  } catch (error) {
      console.warn('Erro ao limpar o redis', error)
  }

  return updatedUser.id;
}
