import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreatePosDTO } from "../../validations/pos-schemas/create-pos-schema";

export async function createPosService(data: CreatePosDTO) {
    try {
        const pos = await prisma.pos.create({
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
        console.error("Error in createPosService:", error);
        throw new AppError("Failed to create pos", 500);
    }
}