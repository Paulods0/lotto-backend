import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { deleteCache } from '../../utils/redis/delete-cache';

export async function deleteUser(id: string, user: AuthPayload) {
  await prisma.$transaction(async tx => {
    const existingUser = await tx.user.findUnique({ where: { id } });

    if (!existingUser) throw new NotFoundError('Usuário não econtrado.');

    await tx.user.delete({
      where: { id },
    });

    const { id: userId, created_at, password, ...rest } = existingUser;

    await audit(tx, 'delete', {
      entity: 'user',
      user,
      after: null,
      before: rest,
    });
  });

  await Promise.all([deleteCache(RedisKeys.users.all()), deleteCache(RedisKeys.auditLogs.all())]);
}
