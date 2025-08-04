import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
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

  try {
    await deleteCache('users:*');
  } catch (error) {
    console.warn('Erro ao limpar o redis', error);
  }

  return updatedUser.id;
}
