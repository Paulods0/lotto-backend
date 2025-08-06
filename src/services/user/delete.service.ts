import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis/delete-cache';
import { RedisKeys } from '../../utils/redis/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLog } from '../audit-log/create.service';

export async function deleteUser(id: string, user: AuthPayload) {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) throw new NotFoundError('Usuário não econtrado.');

  await prisma.$transaction(async (tx) => {
    await prisma.user.delete({
      where: { id },
    });
    const { id: userId, created_at, password, ...rest } = existingUser;
    await createAuditLog(tx, {
      action: 'DELETE',
      entity: 'USER',
      user_name: user.name,
      entity_id: existingUser.id,
      user_id: user.id,
      metadata: rest,
    });
  });

  await deleteCache(RedisKeys.users.all());
}
