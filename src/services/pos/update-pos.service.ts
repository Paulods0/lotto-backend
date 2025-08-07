import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { RedisKeys } from '../../utils/redis/keys';
import { diffObjects } from '../../utils/diff-objects';
import { createAuditLog } from '../audit-log/create.service';
import { deleteCache } from '../../utils/redis/delete-cache';
import { UpdatePosDTO } from '../../validations/pos/update.schema';
import { connectOrDisconnect } from '../../utils/connect-disconnect';

export async function updatePos({ user, ...data }: UpdatePosDTO) {
  await prisma.$transaction(async (tx) => {
    const pos = await tx.pos.findUnique({ where: { id: data.id } });
    if (!pos) throw new NotFoundError('POS não encontrado.');

    if (data.licence_id) {
      const licence = await tx.licence.findUnique({
        where: { id: data.licence_id },
        include: { pos: { select: { id: true } } },
      });

      if (!licence) throw new NotFoundError('Licença não encontrada.');

      const isLicenceChanging = pos.licence_id !== data.licence_id;
      const posCount = licence.pos.length;
      const limit = licence.limit ?? Infinity;

      if (isLicenceChanging && posCount >= limit) {
        throw new Error('Esta licença já atingiu o número máximo de POS permitidos.');
      }

      const limitReached = posCount + (isLicenceChanging ? 1 : 0) >= limit;

      await tx.licence.update({
        where: { id: data.licence_id },
        data: {
          coordinates: data.coordinates,
          status: !limitReached,
        },
      });
    }

    let id_reference: number | null = null;
    let agentUpdate: any = { disconnect: true };

    if (data.agent_id) {
      const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
      if (!agent) throw new NotFoundError('Agente não encontrado.');

      id_reference = agent.id_reference ?? null;
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

      await tx.agent.update({
        where: { id: data.agent_id },
        data: {
          area_id: data.area_id,
          zone_id: data.zone_id,
          city_id: data.city_id,
          province_id: data.province_id,
        },
      });
    }

    const updatedPos = await tx.pos.update({
      where: { id: data.id },
      data: {
        id_reference,
        agent: agentUpdate,
        coordinates: data.coordinates,
        ...connectOrDisconnect('type', data.type_id),
        ...connectOrDisconnect('area', data.area_id),
        ...connectOrDisconnect('zone', data.zone_id),
        ...connectOrDisconnect('city', data.city_id),
        ...connectOrDisconnect('admin', data.admin_id),
        ...connectOrDisconnect('licence', data.licence_id),
        ...connectOrDisconnect('subtype', data.subtype_id),
        ...connectOrDisconnect('province', data.province_id),
      },
    });

    await createAuditLog(tx, {
      action: 'UPDATE',
      entity: 'POS',
      user_name: user.name,
      changes: diffObjects(data, updatedPos),
      user_id: user.id,
      entity_id: data.id,
    });
  });

  await Promise.all([deleteCache(RedisKeys.pos.all()), deleteCache(RedisKeys.auditLogs.all())]);
  if (data.admin_id) await deleteCache(RedisKeys.admins.all());
  if (data.agent_id) await deleteCache(RedisKeys.agents.all());
  if (data.licence_id) await deleteCache(RedisKeys.licences.all());
}
