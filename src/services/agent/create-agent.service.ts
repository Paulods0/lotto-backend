import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { generateIdReference } from '../../utils/generate-id-reference';
import { CreateAgentDTO } from '../../validations/agent-schemas/create-agent-schema';

export async function createAgentService(data: CreateAgentDTO) {
  const id_reference = await generateIdReference(data.type);

  const pos = data.pos_id
    ? await prisma.pos.findUnique({
        where: { id: data.pos_id },
        select: {
          id: true,
          type: true,
          area: true,
          zone: true,
          city: true,
          subtype: true,
          province: true,
        },
      })
    : undefined;

  const connectRelations = {
    ...(data.pos_id && { pos: { connect: { id: data.pos_id } } }),
    ...(data.terminal_id && { terminal: { connect: { id: data.terminal_id } } }),
    ...(pos?.type && { type: { connect: { id: pos.type.id } } }),
    ...(pos?.subtype && { subtype: { connect: { id: pos.subtype.id } } }),
    ...(pos?.area && { area: { connect: { id: pos.area.id } } }),
    ...(pos?.zone && { connect: { id: pos.zone.id } }),
    ...(pos?.province && { province: { connect: { id: pos.province.id } } }),
    ...(pos?.city && { city: { connect: { id: pos.city.id } } }),
  };

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
      ...connectRelations,
    },
  });

  // await prisma.auditLog.create({
  //   data: {
  //     entity: 'agent',
  //     entity_id: agent.id,
  //     action: 'create',
  //     user_name: data.user.name,
  //     user_id: data.user.id,
  //     metadata: agent,
  //   },
  // });

  try {
    await deleteKeysByPattern('agents:*');
    if(data.terminal_id){
      await deleteKeysByPattern('terminals:*');
    }
    if(data.pos_id){
      await deleteKeysByPattern('pos:*');
    }
  } catch (err) {
    console.warn('Erro ao limpar cache de agentes no Redis:', err);
  }

  return agent;
}
