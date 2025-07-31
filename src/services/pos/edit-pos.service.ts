import redis from '../../lib/redis';
import prisma from '../../lib/prisma';
import { EditPosDTO } from '../../validations/pos-schemas/edit-pos-schema';
import { NotFoundError } from '../../errors';

export async function editPosService(data: EditPosDTO) {
  let id_reference: number | null = data.id_reference ?? null;

  let agentData = undefined;

  if (data.agent_id) {
    const agent = await prisma.agent.findUnique({ where: { id: data.agent_id } });
    id_reference = agent?.id_reference ?? null;
    agentData = { connect: { id: data.agent_id } };

    if (id_reference !== null) {
      // Verificar se já existe um POS com esse id_reference (excluindo o atual)
      const existingPos = await prisma.pos.findFirst({
        where: {
          id_reference,
          NOT: { id: data.id },
        },
      });

      // Se existir, removemos o id_reference dele
      if (existingPos) {
        await prisma.pos.update({
          where: { id: existingPos.id },
          data: { id_reference: null },
        });
      }
    }
  } else {
    id_reference = null;
    agentData = { disconnect: true };
  }

  const pos = await prisma.pos.findUnique({ where: { id: data.id } });
  if (!pos) throw new NotFoundError('Pos não encontrado.');

  await prisma.pos.update({
    where: { id: data.id },
    data: {
      id_reference,
      latitude: data.latitude,
      longitude: data.longitude,
      agent: agentData,
      ...(data.licence_id && { licence: { connect: { id: data.licence_id } } }),
      ...(data.type_id && { type: { connect: { id: data.type_id } } }),
      ...(data.area_id && { area: { connect: { id: data.area_id } } }),
      ...(data.zone_id && { zone: { connect: { id: data.zone_id } } }),
      ...(data.city_id && { city: { connect: { id: data.city_id } } }),
      ...(data.admin_id && { admin: { connect: { id: data.admin_id } } }),
      ...(data.agent_id && { agent: { connect: { id: data.agent_id } } }),
      ...(data.licence_id && { licence: { connect: { id: data.licence_id } } }),
      ...(data.province_id && { province: { connect: { id: data.province_id } } }),
    },
  });
}
