import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { CreateTerminalDTO } from '../../validations/terminal-schemas/create-terminal-schema';

export async function createTerminalService(data: CreateTerminalDTO) {
  let id_reference: number | null = null;
  let agentData = null;

  // Buscar dados do agente se informado
  if (data.agent_id) {
    agentData = await prisma.agent.findUnique({
      where: { id: data.agent_id },
      select: {
        id: true,
        id_reference: true,
        city: { select: { id: true } },
        area: { select: { id: true } },
        zone: { select: { id: true } },
        province: { select: { id: true } },
      },
    });

    if (!agentData?.id_reference) {
      throw new Error('O agente não possui um id_reference válido.');
    }

    id_reference = agentData.id_reference;

    // Desvincular terminal existente com mesmo id_reference
    const existing = await prisma.terminal.findFirst({
      where: { id_reference },
      select: { id: true },
    });

    if (existing) {
      await prisma.terminal.update({
        where: { id: existing.id },
        data: { id_reference: null },
      });
    }
  }

  // Criar novo terminal
  const terminal = await prisma.terminal.create({
    data: {
      pin: data.pin,
      puk: data.puk,
      serial: data.serial,
      sim_card: data.sim_card,
      id_reference,
      agent: agentData?.id ? { connect: { id: agentData.id } } : undefined,
      city: agentData?.city?.id ? { connect: { id: agentData.city.id } } : undefined,
      area: agentData?.area?.id ? { connect: { id: agentData.area.id } } : undefined,
      zone: agentData?.zone?.id ? { connect: { id: agentData.zone.id } } : undefined,
      province: agentData?.province?.id ? { connect: { id: agentData.province.id } } : undefined,
      status: agentData ? true : undefined, // Atualiza o status para true se tiver agente
    },
  });

  // Limpar cache Redis
  try {
    await deleteKeysByPattern('terminals:*');
  } catch (error) {
    console.warn('Erro ao limpar cache Redis:', error);
  }

  return terminal.id;
}
