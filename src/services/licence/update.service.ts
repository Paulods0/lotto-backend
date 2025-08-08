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
  if (!admin) throw new NotFoundError('Administração não encontrada');

  await prisma.$transaction(async tx => {
    const after = await tx.licence.update({
      where: { id: data.id },
      data: {
        ...data,
        ...connectOrDisconnect('admin', data.admin_id),
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
