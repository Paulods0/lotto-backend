import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { buildReference } from '../../utils/build-licemce-reference';
import { createAuditLogService } from '../audit-log/create-audit-log-service';
import { CreateLicenceDTO } from '../../validations/licence-schemas/create-licence-schema';

export async function createLicenceService({ user, ...data }: CreateLicenceDTO) {
  let reference = '';

  if (data.admin_id) {
    const admin = await prisma.administration.findUnique({
      where: { id: data.admin_id },
      select: { name: true },
    });

    if (!admin) throw new NotFoundError('A administração não foi encontrada');

    const name = admin.name;
    const number = data.number;
    const year = data.creation_date?.getFullYear() ?? new Date().getFullYear();

    reference = buildReference({
      name,
      number,
      year,
      desc: data.description,
    });
  }

  await prisma.$transaction(async tx => {
    const { id, created_at, ...licence } = await tx.licence.create({
      data: {
        reference,
        file: data.file,
        number: data.number,
        description: data.description,
        creation_date: data.creation_date,
        ...connectIfDefined('admin', data.admin_id),
      },
    });

    await createAuditLogService(tx, {
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
