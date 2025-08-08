import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdateLicenceDTO } from '../../validations/licence/update.schema';

export async function updateLicence({ user, ...data }: UpdateLicenceDTO) {
  const [licence, admin] = await Promise.all([
    prisma.licence.findUnique({
      where: { id: data.id },
      include: { admin: true },
    }),

    data.admin_id ? prisma.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
  ]);

  if (!licence) throw new NotFoundError('Licença não encontrada');
  if (data.admin_id && !admin) throw new NotFoundError('Administração não encontrada');

  const posCount = await prisma.pos.count({
    where: { licence_id: data.id },
  });

  const newStatus = data.limit && posCount < data.limit ? 'livre' : 'em_uso';

  await prisma.$transaction(async tx => {
    const after = await tx.licence.update({
      where: { id: data.id },
      data: {
        file: data.file,
        limit: data.limit,
        status: newStatus,
        number: data.number,
        reference: data.reference,
        expires_at: data.expires_at,
        description: data.description,
        coordinates: data.coordinates,
        creation_date: data.creation_date,
        ...connectOrDisconnect('admin', data.admin_id),
      },
      include: {
        admin: true,
      },
    });

    await audit(tx, 'update', {
      user,
      entity: 'licence',
      before: licence,
      after,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.admins.all()),
    deleteCache(RedisKeys.licences.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);
}
