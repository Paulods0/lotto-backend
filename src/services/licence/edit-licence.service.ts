import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { BadRequestError, NotFoundError } from '../../errors';
import { EditLicenceDTO } from '../../validations/licence-schemas/edit-licence-schema';

export async function updateLicenceService(data: EditLicenceDTO) {
  if (!data.id) throw new BadRequestError('ID da licença não fornecido.');

  const [licence, admin] = await Promise.all([
    prisma.licence.findUnique({
      where: { id: data.id },
      include: { admin: true },
    }),
    data.admin_id
      ? prisma.administration.findUnique({
          where: { id: data.admin_id },
        })
      : Promise.resolve(undefined),
  ]);

  if (!licence) throw new NotFoundError('Licença não encontrada.');

  const number = data.number ?? licence.number;
  const description = data.description ?? licence.description;
  const creation_date = data.creation_date?.getFullYear() ?? licence.created_at.getFullYear();
  const adminName = admin?.name ?? licence.admin?.name;

  const reference = `${adminName ?? 'unknown'}-N${number}-${creation_date}-PT${description}`.toUpperCase();

  await prisma.licence.update({
    where: { id: data.id },
    data: {
      reference,
      number: data.number,
      description: data.description,
      creation_date: data.creation_date,
      ...(data.file && { file: data.file }),
      ...(data.admin_id && { admin: { connect: { id: data.admin_id } } }),
    },
  });

  try {
    await deleteKeysByPattern('licences:*');
  } catch (error) {
    console.warn('Erro ao limpar o redis ', error);
  }
  return licence.id;
}
