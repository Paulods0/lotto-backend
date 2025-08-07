import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { createAuditLog } from '../audit-log/create.service';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { CreateLicenceDTO } from '../../validations/licence/create.schema';

export async function createLicence({ user, ...data }: CreateLicenceDTO) {
  if (data.admin_id) {
    const admin = await prisma.administration.findUnique({
      where: { id: data.admin_id },
      select: { name: true },
    });

    if (!admin) throw new NotFoundError('A administração não foi encontrada');
  }

  await prisma.$transaction(async (tx) => {
    const { id, created_at, ...licence } = await tx.licence.create({
      data: {
        file: data.file,
        limit: data.limit,
        number: data.number,
        reference: data.reference,
        description: data.description,
        expires_at: data.expires_at,
        creation_date: data.creation_date,
        ...connectIfDefined('admin', data.admin_id),
      },
    });

    await createAuditLog(tx, {
      action: 'CREATE',
      entity: 'LICENCE',
      user_name: user.name,
      metadata: licence as Record<string, any>,
      user_id: user.id,
      entity_id: id,
    });
  });

  await Promise.all([await deleteCache(RedisKeys.licences.all()), await deleteCache(RedisKeys.auditLogs.all())]);
}
