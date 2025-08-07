import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { createAuditLog } from '../audit-log/create.service';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { CreatePosDTO } from '../../validations/pos/create.schema';

export async function createPos({ user, ...data }: CreatePosDTO) {
  const result = await prisma.$transaction(async (tx) => {
    let id_reference: number | null = null;

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
      if (!agent) throw new NotFoundError('Agente não encontrado');

      id_reference = agent.id_reference ?? null;

      if (id_reference) {
        const existingPos = await tx.pos.findFirst({ where: { id_reference } });

        if (existingPos) {
          await tx.pos.update({
            where: { id: existingPos.id },
            data: { id_reference: null },
          });
        }
      }
    }

    if (data.licence_id) {
      const licence = await tx.licence.findUnique({
        where: { id: data.licence_id },
        include: { pos: { select: { id: true } } },
      });

      if (!licence) throw new NotFoundError('Licença não encontrada');

      const posCount = licence.pos.length;
      const limit = licence.limit ?? Infinity;

      if (posCount >= limit) {
        throw new BadRequestError('Esta licença já atingiu o número máximo de POS permitidos.');
      }
      const limitReached = posCount + 1 >= limit;

      await tx.licence.update({
        where: { id: licence.id },
        data: {
          coordinates: data.coordinates,
          status: !limitReached,
        },
      });
    }

    const pos = await tx.pos.create({
      data: {
        id_reference,
        coordinates: data.coordinates,
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

    await createAuditLog(tx, {
      action: 'CREATE',
      entity: 'POS',
      user_name: user.name,
      metadata: pos as Record<string, any>,
      user_id: user.id,
      entity_id: pos.id,
    });

    return pos.id;
  });

  await Promise.all([deleteCache(RedisKeys.pos.all()), deleteCache(RedisKeys.auditLogs.all())]);

  if (data.admin_id) await deleteCache(RedisKeys.admins.all());
  if (data.agent_id) await deleteCache(RedisKeys.agents.all());
  if (data.licence_id) await deleteCache(RedisKeys.licences.all());

  return result;
}
