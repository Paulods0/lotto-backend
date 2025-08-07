import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLog } from '../audit-log/create.service';
import { deleteCache } from '../../utils/redis/delete-cache';

export async function deleteLicence(id: string, user: AuthPayload) {
  const licence = await prisma.licence.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!licence) throw new NotFoundError('Licença não encontrada');

  await prisma.$transaction(async (tx) => {
    await tx.licence.delete({ where: { id } });

    const { id: licenceID, ...data } = licence;

    await createAuditLog(tx, {
      action: 'DELETE',
      entity: 'LICENCE',
      user_name: user.name,
      metadata: data,
      user_id: user.id,
      entity_id: id,
    });
  });

  await Promise.all([
    await deleteCache(RedisKeys.licences.all()),
    await deleteCache(RedisKeys.auditLogs.all()),
    await deleteCache(RedisKeys.admins.all()),
  ]);

  return id;
}
