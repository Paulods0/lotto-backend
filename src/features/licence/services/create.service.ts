import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { CreateLicenceDTO } from '../../validations/licence/create.schema';

export async function createLicence(input: CreateLicenceDTO) {
  const { user, ...data } = input;

  await prisma.$transaction(async tx => {
    const admin = await prisma.administration.findUnique({
      where: { id: data.admin_id },
      select: { name: true },
    });

    if (!admin) throw new NotFoundError('A administração não foi encontrada');

    const { id, created_at, ...created } = await tx.licence.create({
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

    await audit(tx, 'create', {
      user,
      entity: 'licence',
      before: null,
      after: created,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.admins.all()),
    deleteCache(RedisKeys.licences.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);
}
