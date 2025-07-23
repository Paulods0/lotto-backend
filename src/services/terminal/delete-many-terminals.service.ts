import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function deleteManyTerminalService(ids: string[]) {
    try {

        const deleted = await prisma.terminal.deleteMany({
            where: { id: { in: ids }}
        })

        if(deleted.count === 0){
            throw new AppError("Nenhum terminal encontrado para remover.")
        }

        const redisKeys = await redis.keys("terminals:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return deleted.count

    } catch (error) {
        console.error("Error in DeleteManyTerminalService:", error);
        throw new AppError("Failed to delete many terminal", 500);
    }
}