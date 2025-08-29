import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdateTerminalDTO } from '../../validations/terminal/update.schema';

export async function updateTerminal({ user, ...data }: UpdateTerminalDTO) {
  await prisma.$transaction(async tx => {
    const terminal = await tx.terminal.findUnique({
      where: { id: data.id },
    });

    if (!terminal) throw new NotFoundError('Terminal não encontrado');

    let id_reference: number | null = null;
    let area_id: number | null = null;
    let city_id: number | null = null;
    let province_id: number | null = null;
    let zone_id: number | null = null;
    let status = false;

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
      if (!agent) throw new NotFoundError('Agente não encontrado');

      id_reference = agent.id_reference;
      area_id = agent.area_id;
      city_id = agent.city_id;
      province_id = agent.province_id;
      zone_id = agent.zone_id;

      await tx.terminal.updateMany({
        where: { agent_id: agent.id },
        data: {
          agent_id: null,
          id_reference: null,
          area_id: null,
          city_id: null,
          province_id: null,
          zone_id: null,
        },
      });
    }

    const { id, created_at, ...updated } = await tx.terminal.update({
      where: { id: data.id },
      data: {
        id_reference,
        note: data.note,
        serial: data.serial,
        status: data.status,
        device_id: data.device_id,
        arrived_at: data.arrived_at,
        ...connectOrDisconnect('area', area_id),
        ...connectOrDisconnect('city', city_id),
        ...connectOrDisconnect('zone', zone_id),
        ...connectOrDisconnect('province', province_id),
        ...connectOrDisconnect('sim_card', data.sim_card_id),
        ...connectOrDisconnect('agent', data.agent_id ?? null),
      },
    });

    await audit(tx, 'update', {
      user,
      entity: 'terminal',
      before: terminal,
      after: updated,
    });
  });

  const promises = [deleteCache(RedisKeys.terminals.all()), deleteCache(RedisKeys.auditLogs.all())];

  if (data.agent_id) {
    promises.push(deleteCache(RedisKeys.agents.all()));
  }

  await Promise.all(promises);
}
