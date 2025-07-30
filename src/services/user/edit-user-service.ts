import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { EditUserDTO } from '../../validations/user/edit-user-schema';
import { NotFoundError } from '../../errors';

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

  const redisKeys = await redis.keys('users:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }

  return updatedUser.id;
}
