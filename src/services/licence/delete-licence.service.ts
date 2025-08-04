import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function deleteLicenceService(id: string) {
  const licence = await prisma.licence.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!licence) throw new NotFoundError('Licença não encontrada');

  await prisma.licence.delete({ where: { id } });

  await deleteCache(RedisKeys.licences.all());

  return id;
}
