import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { CreateLicenceDTO } from '../../validations/licence-schemas/create-licence-schema';

export async function createLicenceService(data: CreateLicenceDTO) {
  const admin = data.admin_id ? await prisma.administration.findUnique({ where: { id: data.admin_id } }) : undefined;

  const adminName = admin?.name ?? 'unknown';
  const licenceNumber = data.number;
  const licenceDescription = data.description;
  const licenceCreatedAt = data.creation_date?.getFullYear() ?? new Date().getFullYear();

  const licence_ref = `${adminName}-N${licenceNumber}-${licenceCreatedAt}-PT${licenceDescription}`;

  const licence = await prisma.licence.create({
    data: {
      file: data.file,
      number: data.number,
      description: data.description,
      creation_date: data.creation_date,
      reference: licence_ref.toUpperCase(),
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
