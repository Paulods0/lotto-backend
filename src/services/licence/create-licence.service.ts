import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { buildReference } from '../../utils/build-licemce-reference';
import { CreateLicenceDTO } from '../../validations/licence-schemas/create-licence-schema';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function createLicenceService(data: CreateLicenceDTO) {
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

  const licence = await prisma.licence.create({
    data: {
      reference,
      file: data.file,
      number: data.number,
      description: data.description,
      creation_date: data.creation_date,
      ...connectIfDefined('admin', data.admin_id),
    },
  });

  await deleteCache(RedisKeys.licences.all());

  return licence.id;
}
