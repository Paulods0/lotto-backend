import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function getTerminalService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const cacheKey = `terminal:${id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }

        const terminal = await prisma.terminal.findUnique({
            where: { id },
        });

        if (!terminal) throw new Error("Terminal não encontrado.")

        const exttime = 60 * 5

        await redis.set(cacheKey, JSON.stringify(terminal), "EX", exttime)
        console.log(cacheKey);

        return terminal;

    } catch (error) {
        console.error("Error in getTerminalService:", error);
        throw new AppError("Failed to get terminal", 500);
    }
}
