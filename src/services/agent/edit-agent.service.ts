import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import { EditAgentDTO } from '../../validations/agent-schemas/edit-agent-schema';

export async function editAgentService(data: EditAgentDTO) {
  const { id, type, first_name, last_name, genre, afrimoney_number, bi_number, status, phone_number, pos_id } = data;

  const existingAgent = await prisma.agent.findUnique({ where: { id } });

  if (!existingAgent) {
    throw new NotFoundError('Agente não encontrado.');
  }

  const pos = pos_id
    ? await prisma.pos.findUnique({
        where: { id: pos_id },
        select: {
          id: true,
          type: true,
          subtype: true,
          area: true,
          zone: true,
          province: true,
        },
      })
    : undefined;

  const connectRelations = {
    ...(pos_id && { pos: { connect: { id: pos_id } } }),
    ...(pos?.type && { type: { connect: { id: pos.type.id } } }),
    ...(pos?.subtype && { subtype: { connect: { id: pos.subtype.id } } }),
    ...(pos?.area && { area: { connect: { id: pos.area.id } } }),
    ...(pos?.zone && { zone: { connect: { id: pos.zone.id } } }),
    ...(pos?.province && { province: { connect: { id: pos.province.id } } }),
  };

  const updatedAgent = await prisma.agent.update({
    where: { id },
    data: {
      agent_type: type,
      first_name,
      last_name,
      genre,
      afrimoney_number,
      bi_number,
      status,
      phone_number,
      ...connectRelations,
    },
  });

  await prisma.auditLog.create({
    data: {
      entity_id: data.id,
      action: 'update',
      entity: 'agent',
      metadata: {
        old: data,
        new: updatedAgent,
      },
      user_id: data.user.id,
      user_name: data.user.name,
    },
  });

  try {
    await deleteKeysByPattern('agents:*');
  } catch (error) {
    console.warn('Erro ao limpar o cache do Redis:', error);
  }

  return updatedAgent;
}
