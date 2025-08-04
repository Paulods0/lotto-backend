import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { createAuditLogService } from '../audit-log/create-audit-log-service';
import { CreateTerminalDTO } from '../../validations/terminal-schemas/create-terminal-schema';

export async function createTerminalService({ user, ...data }: CreateTerminalDTO) {
  return await prisma
    .$transaction(async tx => {
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
            agent_id: null,
            id_reference: null,
            status: false,
            area_id: null,
            city_id: null,
            province_id: null,
            zone_id: null,
          },
        });
      }

      const terminal = await tx.terminal.create({
        data: {
          id_reference,
          pin: data.pin,
          puk: data.puk,
          serial: data.serial,
          sim_card: data.sim_card,
          status: data.agent_id ? true : false,
          ...connectIfDefined('area', area_id),
          ...connectIfDefined('city', city_id),
          ...connectIfDefined('zone', zone_id),
          ...connectIfDefined('province', province_id),
          ...connectIfDefined('agent', data.agent_id ?? null),
        },
        select: {
          id: true,
          agent_id: true,
        },
      });

      await createAuditLogService(tx, {
        action: 'CREATE',
        entity: 'TERMINAL',
        user_id: user.id,
        user_name: user.name,
        entity_id: terminal.id,
        metadata: data,
      });

      return terminal;
    })
    .then(async terminal => {
      await deleteCache(RedisKeys.terminals.all());
      await deleteCache(RedisKeys.auditLogs.all());
      if (terminal.agent_id) {
        await deleteCache(RedisKeys.agents.all());
      }
      return terminal.id;
    });
}
