import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLogService } from '../audit-log/create-audit-log-service';

export async function deleteUserService(id: string, user: AuthPayload) {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) throw new NotFoundError('Usuário não econtrado.');

  await prisma.$transaction(async tx => {
    await prisma.user.delete({
      where: { id },
    });
    const { id: userId, created_at, password, ...rest } = existingUser;
    await createAuditLogService(tx, {
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
