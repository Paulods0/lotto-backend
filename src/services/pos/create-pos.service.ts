import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreatePosDTO } from "../../validations/pos-schemas/create-pos-schema";

export async function createPosService(data: CreatePosDTO) {
    let id_reference = undefined
    try {
        if (data.agent_id) {
        const agent = await prisma.agent.findUnique({ where: { id: data.agent_id } });
        id_reference = agent?.id_reference ?? undefined;

        if (id_reference) {
            // Verificar se já existe um POS com o mesmo id_reference
            const existingPos = await prisma.pos.findFirst({ where: { id_reference } });

            if (existingPos) {
                // Atualizar o POS existente para remover o id_reference
                await prisma.pos.update({
                    where: { id: existingPos.id },
                    data: { id_reference: null }
                });
            }
        }
}
        const pos = await prisma.pos.create({
            data: {
                id_reference,
                latitude: data.latitude,
                longitude: data.longitude,
                ...(data.agent_id && { agent: { connect:{ id: data.agent_id } } }),
                ...(data.licence_id && { licence: { connect:{ id: data.licence_id } } })
            }
        })

        const redisKeys = await redis.keys("pos:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return pos.id

    } catch (error) {
        console.error("Error in createPosService:", error);
        throw new AppError("Failed to create pos", 500);
    }
}