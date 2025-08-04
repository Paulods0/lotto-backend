import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';
import { AuthPayload } from '../../@types/auth-payload';
import { createAuditLogService } from '../audit-log/create-audit-log-service';

export async function deletePosService(id: string, user: AuthPayload) {
  // Verifica se o POS existe
  const pos = await prisma.pos.findUnique({ where: { id } });

  if (!pos) {
    throw new NotFoundError(`POS com o ID ${id} não foi encontrado.`);
  }

  // Se o POS estiver associado a um agente, desassocia e limpa os campos do agente
  if (pos.agent_id) {
    await prisma.agent.update({
      where: { id: pos.agent_id },
      data: {
        type_id: null,
        subtype_id: null,
        zone_id: null,
        area_id: null,
        province_id: null,
        city_id: null,
      },
    });
  }

  // Deleta o POS
  await prisma.$transaction(async tx => {
    const deletedPos = await tx.pos.delete({ where: { id } });

    await createAuditLogService(tx, {
      action: 'DELETE',
      entity: 'POS',
      user_name: user.name,
      metadata: deletedPos as Record<string, any>,
      user_id: user.id,
      entity_id: id,
    });
  });

  // Limpa os caches
  await Promise.all([
    await deleteCache(RedisKeys.pos.all()),
    await deleteCache(RedisKeys.admins.all()),
    await deleteCache(RedisKeys.auditLogs.all()),
    await deleteCache(RedisKeys.agents.all()),
    await deleteCache(RedisKeys.licences.all()),
  ]);
}
