import prisma from '../../lib/prisma';
import deleteKeysByPattern from '../../utils/redis';
import { CreatePosDTO } from '../../validations/pos-schemas/create-pos-schema';

export async function createPosService(data: CreatePosDTO) {
  let id_reference: number | null = null;

  // Se um agente foi fornecido, verificar id_reference
  if (data.agent_id) {
    const agent = await prisma.agent.findUnique({
      where: { id: data.agent_id },
    });

    if (!agent) {
      throw new Error('Agente não encontrado');
    }

    id_reference = agent.id_reference ?? null;

    if (id_reference) {
      // Verificar se já existe um POS com o mesmo id_reference
      const existingPos = await prisma.pos.findFirst({
        where: { id_reference },
      });

      if (existingPos) {
        // Atualizar POS antigo para remover o id_reference
        await prisma.pos.update({
          where: { id: existingPos.id },
          data: { id_reference: null },
        });
      }
    }
  }

  // Criar o novo POS
  const pos = await prisma.pos.create({
    data: {
      id_reference,
      latitude: data.latitude,
      longitude: data.longitude,
      ...(data.type_id && { type: { connect: { id: data.type_id } } }),
      ...(data.subtype_id && { subtype: { connect: { id: data.subtype_id } } }),
      ...(data.area_id && { area: { connect: { id: data.area_id } } }),
      ...(data.zone_id && { zone: { connect: { id: data.zone_id } } }),
      ...(data.city_id && { city: { connect: { id: data.city_id } } }),
      ...(data.admin_id && { admin: { connect: { id: data.admin_id } } }),
      ...(data.agent_id && { agent: { connect: { id: data.agent_id } } }),
      ...(data.licence_id && { licence: { connect: { id: data.licence_id } } }),
      ...(data.province_id && { province: { connect: { id: data.province_id } } }),
    },
  });

  await prisma.auditLog.create({
    data: {
      entity_id: pos.id,
      action: 'create',
      entity: 'pos',
      metadata: {
        data: pos,
      },
      user_id: data.user.id,
      user_name: data.user.name,
    },
  });

  // Limpar o cache relacionado a POS
  try {
    await deleteKeysByPattern('pos:*');
    if(data.agent_id){
      await deleteKeysByPattern('agents:*');
    }
  } catch (error) {
    console.warn('Erro ao limpar cache Redis:', error);
  }

  return pos.id;
}
