import redis from "../../lib/redis";
import isUUID from "../../lib/uuid";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function deleteTerminalService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const terminal = await prisma.terminal.findUnique({ where: { id } })

        if (!terminal) throw new Error("Terminal não encontrado.")

        await prisma.terminal.delete({ where: { id } })

        const redisKeys = await redis.keys("terminals:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }


    } catch (error) {
        console.error("Error in DeleteTerminalService:", error);
        throw new AppError("Failed to delete- terminal", 500);
    }
}