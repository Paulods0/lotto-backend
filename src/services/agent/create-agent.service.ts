import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { generateIdReference } from '../../utils/generate-id-reference';
import { CreateAgentDTO } from '../../validations/agent-schemas/create-agent-schema';

export async function createAgentService(data: CreateAgentDTO) {
  const id_reference = await generateIdReference(data.type);

  const agent = await prisma.agent.create({
    data: {
      id_reference,
      agent_type: data.type,
      first_name: data.first_name,
      last_name: data.last_name,
      genre: data.genre,
      afrimoney_number: data.afrimoney_number,
      bi_number: data.bi_number,
      status: data.status,
      phone_number: data.phone_number,
      ...(data.pos_id && { pos: { connect: { id: data.pos_id } } }),
      ...(data.pos_id && { terminal: { connect: { id: data.terminal_id } } }),
    },
  });
  const redisKeys = await redis.keys('agents:*');

  if (redisKeys.length > 0) {
    await redis.del(...redisKeys);
  }

  return agent;
}
