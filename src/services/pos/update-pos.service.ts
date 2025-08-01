import prisma from '../../lib/prisma';
import { NotFoundError } from '../../errors';
import deleteKeysByPattern from '../../utils/redis';
import { EditPosDTO } from '../../validations/pos-schemas/edit-pos-schema';
import { connect } from 'http2';

export async function editPosService(data: EditPosDTO) {
  const pos = await prisma.pos.findUnique({ where: { id: data.id } });
  if (!pos) throw new NotFoundError('Pos não encontrado.');

  let id_reference: number | null = null;
  let agentUpdate = undefined;

  // Se foi fornecido agent_id
  if (data.agent_id) {
    const agent = await prisma.agent.findUnique({ where: { id: data.agent_id } });
    id_reference = agent?.id_reference ?? null;
    agentUpdate = { connect: { id: data.agent_id } };

    if (id_reference !== null) {
      // Desassociar id_reference de outro POS (exceto o atual)
      const existingPos = await prisma.pos.findFirst({
        where: {
          id_reference,
          NOT: { id: data.id },
        },
      });

      if (existingPos) {
        await prisma.pos.update({
          where: { id: existingPos.id },
          data: { id_reference: null },
        });
      }
    }
  } else {
    agentUpdate = { disconnect: true };
  }

  const updatedPos = await prisma.pos.update({
    where: { id: data.id },
    data: {
      id_reference,
      latitude: data.latitude,
      longitude: data.longitude,
      agent: agentUpdate,
      ...(data.licence_id && { licence: { connect: { id: data.licence_id } } }),
      ...(data.type_id && { type: { connect: { id: data.type_id } } }),
      subtype:data.subtype_id ? { connect:{ id:data.subtype_id }} : { disconnect:true },
      ...(data.area_id && { area: { connect: { id: data.area_id } } }),
      ...(data.zone_id && { zone: { connect: { id: data.zone_id } } }),
      ...(data.city_id && { city: { connect: { id: data.city_id } } }),
      ...(data.admin_id && { admin: { connect: { id: data.admin_id } } }),
      ...(data.province_id && { province: { connect: { id: data.province_id } } }),
    },
  });

  await prisma.auditLog.create({
    data: {
      entity_id: data.id,
      action: 'update',
      entity: 'pos',
      metadata: {
        old: data,
        new: updatedPos,
      },
      user_id: data.user.id,
      user_name: data.user.name,
    },
  });
  // Limpa cache Redis relacionada a POS
  try {
    await deleteKeysByPattern('pos:*');
    if(data.agent_id){
      await deleteKeysByPattern('agents:*');
    }
  } catch (error) {
    console.warn(`[Redis] Falha ao limpar o cache para padrão "pos:*":`, error);
  }
}
