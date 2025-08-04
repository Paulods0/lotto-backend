import prisma from '../../lib/prisma';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { CreatePosDTO } from '../../validations/pos-schemas/create-pos-schema';
import { connectIfDefined } from '../../utils/connect-disconnect';

export async function createPosService(data: CreatePosDTO) {
  const result = await prisma.$transaction(async tx => {
    let id_reference: number | null = null;

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({
        where: { id: data.agent_id },
      });

      if (!agent) throw new Error('Agente não encontrado');

      id_reference = agent.id_reference ?? null;

      if (id_reference) {
        const existingPos = await tx.pos.findFirst({
          where: { id_reference },
        });

        if (existingPos) {
          await tx.pos.update({
            where: { id: existingPos.id },
            data: { id_reference: null },
          });
        }
      }
    }

    const pos = await tx.pos.create({
      data: {
        id_reference,
        latitude: data.latitude,
        longitude: data.longitude,
        ...connectIfDefined('area', data.area_id),
        ...connectIfDefined('type', data.type_id),
        ...connectIfDefined('subtype', data.subtype_id),
        ...connectIfDefined('zone', data.zone_id),
        ...connectIfDefined('city', data.city_id),
        ...connectIfDefined('admin', data.admin_id),
        ...connectIfDefined('agent', data.agent_id),
        ...connectIfDefined('licence', data.licence_id),
        ...connectIfDefined('province', data.province_id),
      },
    });

    return pos.id;
  });

  await deleteCache(RedisKeys.pos.all());
  if (data.admin_id) await deleteCache(RedisKeys.admins.all());
  if (data.agent_id) await deleteCache(RedisKeys.agents.all());
  if (data.licence_id) await deleteCache(RedisKeys.licences.all());

  return result;
}
