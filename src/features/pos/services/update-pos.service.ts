import prisma from '../../../lib/prisma';

import { NotFoundError } from '../../../errors';
import { audit } from '../../../utils/audit-log';
import { RedisKeys } from '../../../utils/redis/keys';
import { UpdatePosDTO } from '../schemas/update.schema';
import { deleteCache } from '../../../utils/redis/delete-cache';

export async function updatePos(data: UpdatePosDTO) {
  await prisma.$transaction(async (tx) => {
    const pos = await tx.pos.findUnique({ where: { id: data.id } });

    if (!pos) throw new NotFoundError('POS não encontrado.');

    const after = await tx.pos.update({
      where: { id: data.id },
      data,
    });

    await audit(tx, 'UPDATE', {
      user: data.user,
      entity: 'POS',
      before: pos,
      after,
    });
  });

  const promises = [deleteCache(RedisKeys.pos.all()), deleteCache(RedisKeys.auditLogs.all())];

  if (data.admin_id) promises.push(deleteCache(RedisKeys.admins.all()));
  if (data.agent_id) promises.push(deleteCache(RedisKeys.agents.all()));
  if (data.licence_id) promises.push(deleteCache(RedisKeys.licences.all()));

  await Promise.all(promises);
}
