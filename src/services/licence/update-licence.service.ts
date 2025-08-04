import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { buildReference } from '../../utils/build-licemce-reference';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { EditLicenceDTO } from '../../validations/licence-schemas/update-licence-schema';

export async function updateLicenceService(data: EditLicenceDTO) {
  const [licence, admin] = await Promise.all([
    prisma.licence.findUnique({
      where: { id: data.id },
      include: { admin: true },
    }),
    data.admin_id ? prisma.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
  ]);

  if (!licence) throw new NotFoundError('Licença não encontrada');

  const number = data.number ?? licence.number;
  const year = data.creation_date?.getFullYear() ?? licence.created_at.getFullYear();
  const name = admin?.name ?? licence.admin?.name;

  const reference = buildReference({ name, number, year, desc: data.description });

  const updatedLicence = await prisma.licence.update({
    where: { id: data.id },
    data: {
      reference,
      number: data.number,
      description: data.description,
      creation_date: data.creation_date,
      ...(data.file && { file: data.file }),
      ...connectOrDisconnect('admin', data.admin_id),
    },
  });

  await deleteCache(RedisKeys.licences.all());

  return updatedLicence.id;
}
