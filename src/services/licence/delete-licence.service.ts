import redis from '../../lib/redis';
import isUUID from '../../lib/uuid';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function deleteLicenceService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const licence = await prisma.licence.findUnique({ where: { id } });

  if (!licence) throw new NotFoundError('Licença não encontrada.');

  await prisma.licence.delete({ where: { id } });

  const redisKeys = await redis.keys('licences:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }
}
