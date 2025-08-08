import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { CreateTerminalDTO } from '../../validations/terminal/create.schema';

export async function createTerminal({ user, ...data }: CreateTerminalDTO) {
  await prisma.$transaction(async tx => {
    let id_reference: number | null = null;
    let area_id: number | null = null;
    let city_id: number | null = null;
    let province_id: number | null = null;
    let zone_id: number | null = null;

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });

      if (!agent) throw new NotFoundError('Agente não encontrado');

      id_reference = agent.id_reference;
      area_id = agent.area_id ?? null;
      city_id = agent.city_id ?? null;
      province_id = agent.province_id ?? null;
      zone_id = agent.zone_id ?? null;

      await tx.terminal.updateMany({
        where: { agent_id: agent.id },
        data: {
          area_id: null,
          city_id: null,
          zone_id: null,
          agent_id: null,
          province_id: null,
          id_reference: null,
        },
      });
    }

    const terminal = await tx.terminal.create({
      data: {
        id_reference,
        pin: data.pin,
        puk: data.puk,
        note: data.note,
        serial: data.serial,
        status: data.status,
        sim_card: data.sim_card,
        device_id: data.device_id,
        delivery_date: data.delivery_date,
        ...connectIfDefined('area', area_id),
        ...connectIfDefined('city', city_id),
        ...connectIfDefined('zone', zone_id),
        ...connectIfDefined('province', province_id),
        ...connectIfDefined('agent', data.agent_id ?? null),
      },
    });

    await audit(tx, 'create', {
      entity: 'terminal',
      user,
      before: null,
      after: terminal,
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
    deleteCache(RedisKeys.agents.all()),
  ]);
}
