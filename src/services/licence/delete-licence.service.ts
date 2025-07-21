import redis from "../../lib/redis";
import isUUID from "../../lib/uuid";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function deleteLicenceService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const licence = await prisma.licence.findUnique({ where: { id } })

        if (!licence) throw new Error("Licença não encontrada.")

        await prisma.licence.delete({ where: { id } })

        const redisKeys = await redis.keys("licences:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

    } catch (error) {
        console.error("Error in DeleteLicenceService:", error);
        throw new AppError("Failed to delete- licence", 500);
    }
}