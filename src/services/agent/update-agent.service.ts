import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { connectOrDisconnect } from '../../utils/connect-disconnect';
import { UpdateAgentDTO } from '../../validations/agent-schemas/update-agent-schema';
import { createAuditLogService } from '../audit-log/create-audit-log-service';
import { diffObjects } from '../../utils/diff-objects';

export async function updateAgentService({ user, ...data }: UpdateAgentDTO) {
  const agent = await prisma.agent.findUnique({ where: { id: data.id } });
  if (!agent) throw new NotFoundError('Agente não encontrado');

  await prisma.$transaction(async tx => {
    // Atualiza dados básicos do agente
    const updated = await tx.agent.update({
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
      },
    });

    // Atualiza o terminal se fornecido
    if (data.terminal_id) {
      // Remove terminal anterior vinculado a este agente
      await tx.terminal.updateMany({
        where: { agent_id: agent.id },
        data: {
          agent_id: null,
          id_reference: null,
          status: false,
        },
      });

      const terminal = await tx.terminal.findUnique({
        where: { id: data.terminal_id },
        select: { agent_id: true },
      });

      if (terminal?.agent_id && terminal.agent_id !== agent.id) {
        await tx.terminal.update({
          where: { id: data.terminal_id },
          data: { agent_id: null, id_reference: null, status: false },
        });
      }

      await tx.terminal.update({
        where: { id: data.terminal_id },
        data: {
          agent_id: agent.id,
          id_reference: agent.id_reference,
          status: true,
        },
      });
    }

    // Atualiza o POS se fornecido
    if (data.pos_id) {
      // Remove POS anterior vinculado a este agente
      await tx.pos.updateMany({
        where: { agent_id: agent.id },
        data: {
          agent_id: null,
          id_reference: null,
        },
      });

      const existingPos = await tx.pos.findUnique({
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

      if (!existingPos) throw new NotFoundError('POS não encontrado');

      if (existingPos.agent_id && existingPos.agent_id !== agent.id) {
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

      // Atualiza os relacionamentos do agente com base no POS
      await tx.agent.update({
        where: { id: agent.id },
        data: {
          ...connectOrDisconnect('area', existingPos.area_id),
          ...connectOrDisconnect('zone', existingPos.zone_id),
          ...connectOrDisconnect('province', existingPos.province_id),
          ...connectOrDisconnect('city', existingPos.city_id),
          ...connectOrDisconnect('type', existingPos.type_id),
          ...connectOrDisconnect('subtype', existingPos.subtype_id),
        },
      });
    }

    await createAuditLogService(tx, {
      action: 'UPDATE',
      entity: 'AGENT',
      user_name: user.name,
      changes: diffObjects(data, updated),
      user_id: user.id,
      entity_id: agent.id,
    });
  });

  // Limpa cache relacionado
  await Promise.all([
    deleteCache(RedisKeys.agents.all()),
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.terminals.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);

  return agent.id;
}
