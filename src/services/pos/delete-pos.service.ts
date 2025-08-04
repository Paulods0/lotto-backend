import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import { deleteCache } from '../../utils/redis';
import { RedisKeys } from '../../utils/cache-keys/keys';

export async function deletePosService(id: string) {
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
  await prisma.pos.delete({ where: { id } });

  // Limpa os caches
  await deleteCache(RedisKeys.pos.all());
  await deleteCache(RedisKeys.admins.all());
  await deleteCache(RedisKeys.agents.all());
  await deleteCache(RedisKeys.licences.all());
}
