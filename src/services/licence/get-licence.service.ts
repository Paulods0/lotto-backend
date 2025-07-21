import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function getLicenceService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const cacheKey = `licences:${id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }

        const licence = await prisma.licence.findUnique({
            where: { id },
        });
        
        if (!licence) throw new Error("licença não encontrado.")

        const exttime = 60 * 5

        await redis.set(cacheKey, JSON.stringify(licence), "EX", exttime)
        console.log(cacheKey);

        return licence;

    } catch (error) {
        console.error("Error in getlicenceService:", error);
        throw new AppError("Failed to get licence", 500);
    }
}
