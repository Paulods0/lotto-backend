import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreateTerminalDTO } from "../../validations/terminal-schemas/create-terminal-schema";

export async function createTerminalService(data: CreateTerminalDTO) {
    try {
        const terminal = await prisma.terminal.create({
            data: {
                pin: data.pin,
                puk: data.puk,
                status: data.status,
                serial: data.serial,
                sim_card: data.sim_card,
                agent: data.agent_id ? { connect: { id: data.agent_id } } : undefined,
            }
        })

        const redisKeys = await redis.keys("terminals:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return terminal.id

    } catch (error) {
        console.error("Error in createTerminalService:", error);
        throw new AppError("Failed to create terminal", 500);
    }
}