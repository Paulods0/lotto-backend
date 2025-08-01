import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import { EditAgentDTO } from '../../validations/agent-schemas/edit-agent-schema';

export async function editAgentService(data: EditAgentDTO) {
  const {
    id,
    type,
    first_name,
    last_name,
    genre,
    afrimoney_number,
    bi_number,
    status,
    phone_number,
    pos_id,
    terminal_id,
    user,
  } = data;
  
  const existingAgent = await prisma.agent.findUnique({
    where: { id },
    include: {
      pos: true,
      terminal: true,
    },
  });

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
    ...(terminal_id && { terminal: { connect: { id: terminal_id } } }),
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

  // Atualizar id_reference nos dispositivos associados (Pos e Terminal)
  if (existingAgent.id_reference) {
    // Remover id_reference do POS antigo se for diferente do atual
    if (existingAgent.pos && existingAgent.pos.id !== pos_id) {
      await prisma.pos.update({
        where: { id: existingAgent.pos.id },
        data: { id_reference: null },
      });
    }

    // Remover id_reference do TERMINAL antigo se for diferente do atual
    if (existingAgent.terminal && existingAgent.terminal.id !== terminal_id) {
      await prisma.terminal.update({
        where: { id: existingAgent.terminal.id },
        data: { id_reference: null },
      });
    }

    // Atribuir id_reference ao novo POS
    if (pos_id) {
      await prisma.pos.update({
        where: { id: pos_id },
        data: { id_reference: existingAgent.id_reference },
      });
    }

    // Atribuir id_reference ao novo TERMINAL
    if (terminal_id) {
      await prisma.terminal.update({
        where: { id: terminal_id },
        data: { id_reference: existingAgent.id_reference },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      entity_id: id,
      action: 'update',
      entity: 'agent',
      metadata: {
        old: data,
        new: updatedAgent,
      },
      user_id: user.id,
      user_name: user.name,
    },
  });

  try {
    await deleteKeysByPattern('agents:*');
    if(data.terminal_id){
      await deleteKeysByPattern('terminals:*');
    }
    if(data.pos_id){
      await deleteKeysByPattern('pos:*');
    }
  } catch (error) {
    console.warn('Erro ao limpar o cache do Redis:', error);
  }

  return updatedAgent;
}
