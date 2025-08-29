import { AuthPayload } from '../../../@types/auth-payload';
import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';

export async function deleteLicence(id: string, user: AuthPayload) {
  await prisma.$transaction(async (tx) => {
    const licence = await tx.licence.findUnique({
      where: { id },
    });

    if (!licence) throw new NotFoundError('Licença não encontrada');

    await tx.licence.delete({ where: { id } });

    await audit(tx, 'DELETE', {
      user,
      entity: 'LICENCE',
      before: licence,
      after: null,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.admins.all()),
    deleteCache(RedisKeys.licences.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);

  return id;
}
