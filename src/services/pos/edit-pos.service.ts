import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditPosDTO } from "../../validations/pos-schemas/edit-pos-schema";

export async function editPosService(data: EditPosDTO) {
    try {
        if (!isUUID(data.id)) throw new Error("ID inválido.")

        const pos = await prisma.pos.findUnique({ where: { id: data.id } })

        if (!pos) throw new Error("Pos não encontrado.")

        await prisma.pos.update({
            where: { id: data.id },
            data: {
                latitude: data.latitude,
                longitude: data.longitude,
                id_reference: data.id_reference,
                licence: data.licence_id ? { connect: { id: data.licence_id } } : undefined,
                agent: data.agent_id ? { connect: { id: data.agent_id } } : undefined,
            }
        })

        const redisKeys = await redis.keys("pos:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return pos.id

    } catch (error) {
        console.error("Error in EditPosService:", error);
        throw new AppError("Failed to edit pos", 500);
    }
}