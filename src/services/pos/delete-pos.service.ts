import redis from "../../lib/redis";
import isUUID from "../../lib/uuid";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function deletePosService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const pos = await prisma.pos.findUnique({ where: { id } })

        if (!pos) throw new Error("Pos não encontrado.")

        await prisma.pos.delete({ where: { id } })

        const redisKeys = await redis.keys("pos:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }


    } catch (error) {
        console.error("Error in DeletePosService:", error);
        throw new AppError("Failed to delete pos", 500);
    }
}