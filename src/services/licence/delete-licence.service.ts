import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLogService } from '../audit-log/create-audit-log-service';

export async function deleteLicenceService(id: string, user: AuthPayload) {
  const licence = await prisma.licence.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!licence) throw new NotFoundError('Licença não encontrada');

  await prisma.$transaction(async tx => {
    await tx.licence.delete({ where: { id } });

    const { id: licenceID, ...data } = licence;

    await createAuditLogService(tx, {
      action: 'DELETE',
      entity: 'LICENCE',
      user_name: user.name,
      metadata: data,
      user_id: user.id,
      entity_id: id,
    });
  });

  await Promise.all([await deleteCache(RedisKeys.licences.all()), await deleteCache(RedisKeys.auditLogs.all())]);

  return id;
}
