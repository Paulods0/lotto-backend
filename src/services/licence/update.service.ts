import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { diffObjects } from '../../utils/diff-objects';
import { createAuditLog } from '../audit-log/create.service';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdateLicenceDTO } from '../../validations/licence/update.schema';
import { buildLicenceReference } from '../../utils/build-licence-reference';

export async function updateLicence({ user, ...data }: UpdateLicenceDTO) {
  const [licence, admin] = await Promise.all([
    prisma.licence.findUnique({
      where: { id: data.id },
      include: { admin: true },
    }),
    data.admin_id ? prisma.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
  ]);

  if (!licence) throw new NotFoundError('Licença não encontrada');

  const number = data.number ?? licence.number;
  const year = data.creation_date ?? licence.created_at;
  const name = admin?.name ?? licence.admin?.name;

  const reference = buildLicenceReference({ name, number, year, desc: data.description });

  await prisma.$transaction(async (tx) => {
    const updated = await tx.licence.update({
      where: { id: data.id },
      data: {
        reference,
        file: data.file,
        limit: data.limit,
        number: data.number,
        description: data.description,
        creation_date: data.creation_date,
        expires_at: data.expires_at,
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
