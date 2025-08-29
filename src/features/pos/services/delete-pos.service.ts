import { AuthPayload } from '../../../@types/auth-payload';
import { NotFoundError } from '../../../errors';
import prisma from '../../../lib/prisma';
import { audit } from '../../../utils/audit-log';
import { deleteCache } from '../../../utils/redis/delete-cache';
import { RedisKeys } from '../../../utils/redis/keys';

export async function deletePosService(id: string, user: AuthPayload) {
  await prisma.$transaction(async (tx) => {
    const pos = await tx.pos.findUnique({ where: { id } });
    if (!pos) throw new NotFoundError(`O POS não foi encontrado.`);

    // Se o POS estiver associado a um agente, limpa os campos do agente
    if (pos.agent_id) {
      await tx.agent.update({
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

    await tx.pos.delete({ where: { id } });

    if (pos.licence_id) {
      const remainingPosCount = await tx.pos.count({
        where: { licence_id: pos.licence_id },
      });

      const status = remainingPosCount === 0 ? 'livre' : 'em_uso';

      await tx.licence.update({
        where: { id: pos.licence_id },
        data: { status },
      });
    }

    await audit(tx, 'DELETE', {
      entity: 'POS',
      user,
      after: null,
      before: pos,
    });
  });

  // Limpa os caches
  await Promise.all([
    deleteCache(RedisKeys.pos.all()),
    deleteCache(RedisKeys.admins.all()),
    deleteCache(RedisKeys.agents.all()),
    deleteCache(RedisKeys.licences.all()),
    deleteCache(RedisKeys.auditLogs.all()),
  ]);
}
