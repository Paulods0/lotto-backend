import prisma from '../../lib/prisma';
import { BadRequestError, NotFoundError } from '../../errors';
import { audit } from '../../utils/audit-log';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { UpdatePosDTO } from '../../validations/pos/update.schema';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { Pos, Prisma } from '@prisma/client';

export async function updatePos({ user, ...data }: UpdatePosDTO) {
  await prisma.$transaction(async tx => {
    const pos = await tx.pos.findUnique({ where: { id: data.id } });

    if (!pos) throw new NotFoundError('POS não encontrado.');

    // Gerencia relacionamento com o agente
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

    // Atualiza o POS
    const after = await tx.pos.update({
      where: { id: data.id },
      data: {
        id_reference,
        agent: agentUpdate,
        coordinates: data.coordinates,
        ...connectOrDisconnect('type', data.type_id),
        ...connectOrDisconnect('subtype', data.subtype_id),
        ...connectOrDisconnect('province', data.province_id),
        ...connectOrDisconnect('area', data.area_id),
        ...connectOrDisconnect('zone', data.zone_id),
        ...connectOrDisconnect('city', data.city_id),
        ...connectOrDisconnect('admin', data.admin_id),
        ...connectOrDisconnect('licence', data.licence_id),
      },
    });

    const licenceWasRemoved = !data.licence_id && pos.licence_id;
    const licenceChanged = pos.licence_id !== data.licence_id;

    // Caso a licença anterior tenha sido removida
    if ((licenceChanged || licenceWasRemoved) && pos.licence_id) {
      const oldLicence = await tx.licence.findUnique({
        where: { id: pos.licence_id },
      });

      if (!oldLicence) throw new NotFoundError('Licença anterior não encontrada.');

      const remainingPos = await tx.pos.count({
        where: { licence_id: pos.licence_id, NOT: { id: data.id } },
      });

      const newStatus = remainingPos >= (oldLicence.limit ?? Infinity) ? 'em_uso' : 'livre';

      await tx.licence.update({
        where: { id: pos.licence_id },
        data: { status: newStatus },
      });
    }

    // Caso esteja conectando uma nova licença
    if (data.licence_id) {
      const newLicence = await tx.licence.findUnique({
        where: { id: data.licence_id },
      });

      if (!newLicence) throw new NotFoundError('Nova licença não encontrada.');

      const totalPos = await tx.pos.count({
        where: {
          licence_id: data.licence_id,
          NOT: { id: data.id },
        },
      });

      const limit = newLicence.limit ?? Infinity;

      if (licenceChanged && totalPos >= limit) {
        throw new BadRequestError('Esta licença já atingiu o número máximo de POS permitidos.');
      }

      const newStatus = totalPos + 1 >= limit ? 'em_uso' : 'livre';

      await tx.licence.update({
        where: { id: data.licence_id },
        data: {
          coordinates: data.coordinates,
          status: newStatus,
        },
      });
    }
    // Registra no log de auditoria
    await audit<Pos>(tx, 'update', {
      user,
      entity: 'pos',
      before: pos,
      after,
    });
  });

  // Limpa os caches afetados
  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.auditLogs.all()),
    data.admin_id && deleteCache(RedisKeys.admins.all()),
    data.agent_id && deleteCache(RedisKeys.agents.all()),
    data.licence_id && deleteCache(RedisKeys.licences.all()),
  ]);
}

async function validateAndUpdateLicence(
  tx: Prisma.TransactionClient,
  posId: string,
  licenceId: string,
  coordinates: string
) {
  const licence = await tx.licence.findUnique({ where: { id: licenceId } });
  if (!licence) throw new NotFoundError('Licença não encontrada.');

  const totalPos = await tx.pos.count({
    where: { licence_id: licenceId, NOT: { id: posId } },
  });

  const limit = licence.limit ?? Infinity;
  const limitReached = totalPos + 1 >= limit;

  const newStatus = limitReached ? 'em_uso' : 'livre';

  await tx.licence.update({
    where: { id: licenceId },
    data: {
      coordinates,
      status: newStatus,
    },
  });

  if (totalPos >= limit) {
    throw new Error('Esta licença já atingiu o número máximo de POS permitidos.');
  }
}
