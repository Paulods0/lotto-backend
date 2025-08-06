import prisma from '../../lib/prisma';
import { RedisKeys } from '../../utils/redis/keys';
import { deleteCache } from '../../utils/redis/delete-cache';
import { createAuditLog } from '../audit-log/create.service';
import { connectIfDefined } from '../../utils/connect-disconnect';
import { CreateAgentDTO } from '../../validations/agent/create.schema';

export async function createAgent({ user, ...data }: CreateAgentDTO) {
  const createdAgent = await prisma.$transaction(async (tx) => {
    const idReference = await tx.idReference.update({
      where: { type: data.type },
      data: {
        counter: { increment: 1 },
      },
    });

    const agent = await tx.agent.create({
      data: {
        id_reference: idReference.counter,
        first_name: data.first_name,
        last_name: data.last_name,
        agent_type: data.type,
        genre: data.genre,
        phone_number: data.phone_number,
        afrimoney_number: data.afrimoney_number,
        status: data.status,
        bi_number: data.bi_number,
      },
    });

    if (data.terminal_id) {
      await tx.terminal.update({
        where: { id: data.terminal_id },
        data: {
          agent_id: null,
          id_reference: null,
          status: false,
        },
      });

      await tx.terminal.update({
        where: { id: data.terminal_id },
        data: {
          agent_id: agent.id,
          id_reference: agent.id_reference,
          status: true,
        },
      });
    }

    if (data.pos_id) {
      await tx.pos.update({
        where: { id: data.pos_id },
        data: {
          agent_id: null,
          id_reference: null,
        },
      });

      const pos = await tx.pos.update({
        where: { id: data.pos_id },
        data: {
          agent_id: agent.id,
          id_reference: agent.id_reference,
        },
        select: {
          area_id: true,
          zone_id: true,
          city_id: true,
          type_id: true,
          subtype_id: true,
          province_id: true,
        },
      });

      await tx.agent.update({
        where: { id: agent.id },
        data: {
          ...connectIfDefined('area', pos.area_id),
          ...connectIfDefined('zone', pos.zone_id),
          ...connectIfDefined('province', pos.province_id),
          ...connectIfDefined('city', pos.city_id),
          ...connectIfDefined('type', pos.type_id),
          ...connectIfDefined('subtype', pos.subtype_id),
        },
      });
    }

    await createAuditLog(tx, {
      action: 'CREATE',
      entity: 'AGENT',
      user_name: user.name,
      metadata: data,
      user_id: user.id,
      entity_id: agent.id,
    });

    return agent;
  });

  await Promise.all([
    deleteCache(RedisKeys.agents.all()),
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);

  return createdAgent.id;
}
