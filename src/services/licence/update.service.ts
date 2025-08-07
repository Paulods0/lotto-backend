import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { diffObjects } from '../../utils/diff-objects';
import { createAuditLog } from '../audit-log/create.service';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdateLicenceDTO } from '../../validations/licence/update.schema';

export async function updateLicence({ user, ...data }: UpdateLicenceDTO) {
  const [licence, _admin] = await Promise.all([
    prisma.licence.findUnique({
      where: { id: data.id },
      include: { admin: true },
    }),
    data.admin_id ? prisma.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
  ]);

  if (!licence) throw new NotFoundError('Licença não encontrada');

  await prisma.$transaction(async (tx) => {
    const updated = await tx.licence.update({
      where: { id: data.id },
      data: {
        file: data.file,
        limit: data.limit,
        number: data.number,
        reference: data.reference,
        expires_at: data.expires_at,
        description: data.description,
        creation_date: data.creation_date,
        ...(data.file && { file: data.file }),
        ...connectOrDisconnect('admin', data.admin_id),
      },
    });

    await createAuditLog(tx, {
      action: 'UPDATE',
      entity: 'LICENCE',
      user_name: user.name,
      changes: diffObjects(data, updated),
      user_id: user.id,
      entity_id: licence.id,
    });
  });

  await Promise.all([await deleteCache(RedisKeys.licences.all()), await deleteCache(RedisKeys.auditLogs.all())]);
}
