import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export async function getAgentService(id: string) {
    try {

        if (!isUUID(id)) throw new Error("ID inválido.")

        const cacheKey = `agent:${id}`
        const cached = await redis.get(cacheKey)

        if (cached) {
            console.log("Cache hit");
            return JSON.parse(cached)
        }

        const agent = await prisma.agent.findUnique({
            where: { id },
        });

        if (!agent) throw new Error("Agente não encontrado.")

        const exttime = 60 * 5

        await redis.set(cacheKey, JSON.stringify(agent), "EX", exttime)
        console.log(cacheKey);

        return agent;

    } catch (error) {
        console.error("Error in getAgentService:", error);
        throw new AppError("Failed to get agent", 500);
    }
}
