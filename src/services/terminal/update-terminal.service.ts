import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { UpdateTerminalDTO } from '../../validations/terminal-schemas/update-terminal-schema';
import { connectOrDisconnect } from '../../utils/connect-disconnect';

export async function updateTerminalService(data: UpdateTerminalDTO) {
  return await prisma
    .$transaction(async tx => {
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
        status = true;

        await tx.terminal.updateMany({
          where: { agent_id: agent.id },
          data: {
            agent_id: null,
            id_reference: null,
            area_id: null,
            city_id: null,
            province_id: null,
            zone_id: null,
            status: false,
          },
        });
      }

      const updated = await tx.terminal.update({
        where: { id: data.id },
        data: {
          status,
          id_reference,
          pin: data.pin,
          puk: data.puk,
          serial: data.serial,
          sim_card: data.sim_card,
          ...connectOrDisconnect('area', area_id),
          ...connectOrDisconnect('city', city_id),
          ...connectOrDisconnect('zone', zone_id),
          ...connectOrDisconnect('province', province_id),
          ...connectOrDisconnect('agent', data.agent_id ?? null),
        },
      });

      return updated;
    })
    .then(async terminal => {
      await deleteCache(RedisKeys.terminals.all());
      if (terminal.agent_id) {
        await deleteCache(RedisKeys.agents.all());
      }
      return terminal.id;
    });
}
