import isUUID from '../../lib/uuid';
import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';

export async function getLicenceService(id: string) {
  if (!isUUID(id)) throw new BadRequestError('ID inválido.');

  const cacheKey = `licences:${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const licence = await prisma.licence.findUnique({
    where: { id },
  });

  if (!licence) throw new NotFoundError('Licença não encontrada.');

  const exttime = 60 * 5;

  await redis.set(cacheKey, JSON.stringify(licence), 'EX', exttime);
  console.log(cacheKey);

  return licence;
}
