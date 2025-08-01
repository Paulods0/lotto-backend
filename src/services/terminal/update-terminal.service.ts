import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import { EditTerminalDTO } from '../../validations/terminal-schemas/edit-terminal-schema';

export async function editTerminalService(data: EditTerminalDTO) {
  let id_reference = null;
  let agentData: any = undefined;

  let relatedFields = {};

  if (data.agent_id) {
    const agent = await prisma.agent.findUnique({
      where: { id: data.agent_id },
      select: {
        id_reference: true,
        subtype: true,
        area: true,
        zone: true,
        province: true,
        city: true,
      },
    });

    if (!agent) {
      throw new NotFoundError('Agente não encontrado.');
    }

    id_reference = agent.id_reference ?? null;

    agentData = { connect: { id: data.agent_id } };

    if (id_reference !== null) {
      const existingTerminal = await prisma.terminal.findFirst({
        where: {
          id_reference,
          NOT: { id: data.id },
        },
      });

      if (existingTerminal) {
        await prisma.terminal.update({
          where: { id: existingTerminal.id },
          data: { id_reference: null },
        });
      }
    }

    data.status = true;

    // Campos relacionados ao agente
    relatedFields = {
      area: agent.area ? { connect: { id: agent.area.id } } : undefined,
      zone: agent.zone ? { connect: { id: agent.zone.id } } : undefined,
      province: agent.province ? { connect: { id: agent.province.id } } : undefined,
      city: agent.city ? { connect: { id: agent.city.id } } : undefined,
    };
  } else {
    id_reference = null;
    agentData = { disconnect: true };
    data.status = false;
  }

  const terminal = await prisma.terminal.findUnique({
    where: { id: data.id },
  });

  if (!terminal) {
    throw new NotFoundError('Terminal não encontrado.');
  }

  const terminalUpdated = await prisma.terminal.update({
    where: { id: data.id },
    data: {
      id_reference,
      pin: data.pin,
      puk: data.puk,
      status: data.status,
      serial: data.serial,
      sim_card: data.sim_card,
      agent: agentData,
      ...relatedFields, // adiciona os relacionamentos com type, subtype etc.
    },
  });

  // await prisma.auditLog.create({
  //   data: {
  //     entity_id: data.id,
  //     action: 'update',
  //     entity: 'terminal',
  //     metadata: {
  //       old: data,
  //       new: terminalUpdated,
  //     },
  //     user_id: data.user.id,
  //     user_name: data.user.name,
  //   },
  // });

  try {
    await deleteKeysByPattern('terminals:*');
    if(data.agent_id){
      await deleteKeysByPattern('agents:*');
    }
  } catch (error) {
    console.warn(`[Redis] Falha ao limpar o cache para padrão "terminals:*":`, error);
  }

  return terminal.id;
}
