import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { connectIfDefined } from '../../../utils/connect-disconnect';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';
import { CreateAgentDTO } from '../schemas/create-agent.schema';

export async function createAgent({ user, ...data }: CreateAgentDTO) {
  await prisma.$transaction(async (tx) => {
    // Atualiza referência
    const idReference = await tx.idReference.update({
      where: { type: data.type },
      data: { counter: { increment: 1 } },
    });

    // Cria o agente
    let agent = await tx.agent.create({
      data: {
        genre: data.genre,
        status: data.status,
        agent_type: data.type,
        bi_number: data.bi_number,
        last_name: data.last_name,
        first_name: data.first_name,
        phone_number: data.phone_number,
        id_reference: idReference.counter,
        training_date: data.training_date,
        afrimoney_number: data.afrimoney_number,
      },
    });

    // Se tiver terminal associado
    if (data.terminal_id) {
      await tx.terminal.update({
        where: { id: data.terminal_id },
        data: {
          agent_id: agent.id,
          id_reference: agent.id_reference,
          status: 'em_campo',
        },
      });
    }

    // Se tiver POS associado
    if (data.pos_id) {
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

      agent = await tx.agent.update({
        where: { id: agent.id },
        data: {
          ...connectIfDefined('area', pos.area_id),
          ...connectIfDefined('zone', pos.zone_id),
          ...connectIfDefined('city', pos.city_id),
          ...connectIfDefined('type', pos.type_id),
          ...connectIfDefined('subtype', pos.subtype_id),
          ...connectIfDefined('province', pos.province_id),
        },
      });
    }

    // Auditoria
    await audit(tx, 'create', {
      user,
      before: null,
      after: agent,
      entity: 'agent',
    });
  });

  // Limpa cache
  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.agents.all()),
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);
}
