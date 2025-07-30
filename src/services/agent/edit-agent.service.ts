import isUUID from '../../lib/uuid';
import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { EditAgentDTO } from '../../validations/agent-schemas/edit-agent-schema';
import { BadRequestError, InternalServerError, NotFoundError } from '../../errors';

export async function editAgentService(data: EditAgentDTO) {
  if (!isUUID(data.id)) throw new BadRequestError('ID inválido.');

  const agent = await prisma.agent.findUnique({ where: { id: data.id } });

  if (!agent) throw new NotFoundError('Agente não encontrado.');

  await prisma.agent.update({
    where: { id: data.id },
    data: {
      agent_type: data.type,
      first_name: data.first_name,
      last_name: data.last_name,
      genre: data.genre,
      afrimoney_number: data.afrimoney_number,
      bi_number: data.bi_number,
      status: data.status,
      phone_number: data.phone_number,
    },
  });

  const redisKeys = await redis.keys('agents:*');
  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }

  return agent;
}
