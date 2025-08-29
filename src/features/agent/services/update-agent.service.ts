import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { connectOrDisconnect } from '../../../utils/connect-disconnect';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';
import { UpdateAgentDTO } from '../schemas/update-agent.schema';

export async function updateAgent({ user, ...data }: UpdateAgentDTO) {
  await prisma.$transaction(async (tx) => {
    const agent = await tx.agent.findUnique({ where: { id: data.id } });

    if (!agent) throw new NotFoundError('Agente não encontrado');
    let extraRelations = {};

    // Terminal reassociation
    if (data.terminal_id !== undefined) {
      await tx.terminal.updateMany({
        where: { agent_id: agent.id },
        data: { agent_id: null, id_reference: null },
      });

      if (data.terminal_id !== null) {
        const terminal = await tx.terminal.findUnique({
          where: { id: data.terminal_id },
        });

        if (!terminal) throw new NotFoundError('Terminal não encontrado');

        if (terminal.agent_id && terminal.agent_id !== agent.id) {
          await tx.terminal.update({
            where: { id: data.terminal_id },
            data: { agent_id: null, id_reference: null },
          });
        }

        await tx.terminal.update({
          where: { id: data.terminal_id },
          data: {
            agent_id: agent.id,
            id_reference: agent.id_reference,
          },
        });
      }
    }

    // POS reassociation
    if (data.pos_id !== undefined) {
      await tx.pos.updateMany({
        where: { agent_id: agent.id },
        data: { agent_id: null, id_reference: null },
      });

      if (data.pos_id !== null) {
        const pos = await tx.pos.findUnique({
          where: { id: data.pos_id },
          select: {
            agent_id: true,
            area_id: true,
            zone_id: true,
            city_id: true,
            province_id: true,
            type_id: true,
            subtype_id: true,
          },
        });

        if (!pos) throw new NotFoundError('POS não encontrado');

        if (pos.agent_id && pos.agent_id !== agent.id) {
          await tx.pos.update({
            where: { id: data.pos_id },
            data: { agent_id: null, id_reference: null },
          });
        }

        await tx.pos.update({
          where: { id: data.pos_id },
          data: {
            agent_id: agent.id,
            id_reference: agent.id_reference,
          },
        });

        extraRelations = {
          ...connectOrDisconnect('area', pos.area_id),
          ...connectOrDisconnect('zone', pos.zone_id),
          ...connectOrDisconnect('province', pos.province_id),
          ...connectOrDisconnect('city', pos.city_id),
          ...connectOrDisconnect('type', pos.type_id),
          ...connectOrDisconnect('subtype', pos.subtype_id),
        };
      }
    }

    // Atualiza agente com todos os dados de uma vez
    const updatedAgent = await tx.agent.update({
      where: { id: data.id },
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        agent_type: data.type,
        genre: data.genre,
        bi_number: data.bi_number,
        phone_number: data.phone_number,
        afrimoney_number: data.afrimoney_number,
        status: data.status,
        training_date: data.training_date,
        ...extraRelations,
      },
    });

    await audit(tx, 'update', {
      user,
      before: agent,
      after: updatedAgent,
      entity: 'agent',
    });
  });

  await Promise.all([
    deleteCache(RedisKeys.agents.all()),
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);
}
