import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis/delete-cache';
import { diffObjects } from '../../utils/diff-objects';
import { RedisKeys } from '../../utils/redis/keys';
import { createAuditLog } from '../audit-log/create.service';
import { UpdateUserDTO } from '../../validations/user/update.schema';

export async function updateUser({ user, ...data }: UpdateUserDTO) {
  const existingUser = await prisma.user.findUnique({ where: { id: data.id } });

  if (!existingUser) throw new NotFoundError('Usuário não encontrado.');

  await prisma.$transaction(async (tx) => {
    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
      },
    });

    await createAuditLog(tx, {
      action: 'UPDATE',
      entity: 'USER',
      user_name: user.name,
      changes: diffObjects(existingUser, updatedUser),
      user_id: user.id,
      entity_id: existingUser.id,
    });
  });

  await deleteCache(RedisKeys.users.all());
}
