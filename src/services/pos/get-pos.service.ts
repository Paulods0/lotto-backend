import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function getPosService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const cacheKey = `pos:${id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }

        const pos = await prisma.pos.findUnique({ where: { id } });

        if (!pos) throw new Error("Pos não encontrado.")

        const exttime = 60 * 5

        await redis.set(cacheKey, JSON.stringify(pos), "EX", exttime)

        return pos;

    } catch (error) {
        console.error("Error in getPosService:", error);
        throw new AppError("Failed to get pos", 500);
    }
}
