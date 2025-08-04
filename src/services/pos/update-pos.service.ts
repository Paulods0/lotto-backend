import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdatePosDTO } from '../../validations/pos-schemas/update-pos-schema';

export async function updatePosService(data: UpdatePosDTO) {
  return await prisma.$transaction(async tx => {
    const pos = await tx.pos.findUnique({ where: { id: data.id } });
    if (!pos) throw new NotFoundError('Pos não encontrado.');

    let id_reference: number | null = null;
    let agentUpdate = undefined;

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
      id_reference = agent?.id_reference ?? null;
      agentUpdate = { connect: { id: data.agent_id } };

      if (id_reference !== null) {
        const existingPos = await tx.pos.findFirst({
          where: {
            id_reference,
            NOT: { id: data.id },
          },
        });

        if (existingPos) {
          await tx.pos.update({
            where: { id: existingPos.id },
            data: { id_reference: null },
          });
        }
      }

      // Atualiza os dados geográficos do agent
      await tx.agent.update({
        where: { id: data.agent_id },
        data: {
          area_id: data.area_id,
          zone_id: data.zone_id,
          province_id: data.province_id,
          city_id: data.city_id,
        },
      });
    } else {
      agentUpdate = { disconnect: true };
    }

    const updatedPos = await tx.pos.update({
      where: { id: data.id },
      data: {
        id_reference,
        latitude: data.latitude,
        longitude: data.longitude,
        agent: agentUpdate,
        ...connectOrDisconnect('licence', data.licence_id),
        ...connectOrDisconnect('type', data.type_id),
        ...connectOrDisconnect('subtype', data.subtype_id),
        ...connectOrDisconnect('area', data.area_id),
        ...connectOrDisconnect('zone', data.zone_id),
        ...connectOrDisconnect('city', data.city_id),
        ...connectOrDisconnect('admin', data.admin_id),
        ...connectOrDisconnect('province', data.province_id),
      },
    });

    await deleteCache(RedisKeys.pos.all());
    if (data.admin_id) await deleteCache(RedisKeys.admins.all());
    if (data.agent_id) await deleteCache(RedisKeys.agents.all());
    if (data.licence_id) await deleteCache(RedisKeys.licences.all());

    return updatedPos.id;
  });
}
