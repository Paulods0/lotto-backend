import isUUID from "../../lib/uuid";
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditTerminalDTO } from "../../validations/terminal-schemas/edit-terminal-schema";

export async function editTerminalService(data: EditTerminalDTO) {
    try {
        if (!isUUID(data.id)) throw new Error("ID inválido.")

        const terminal = await prisma.terminal.findUnique({ where: { id: data.id } })

        if (!terminal) throw new Error("Terminal não encontrado.")

        await prisma.terminal.update({
            where: { id: data.id },
            data: {
                pin: data.pin,
                puk: data.puk,
                status: data.status,
                serial: data.serial,
                sim_card: data.sim_card,
                agent: data.agent_id ? { connect: { id: data.agent_id } } : undefined
            }
        })

        const redisKeys = await redis.keys("terminals:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return terminal.id

    } catch (error) {
        console.error("Error in EditTerminalService:", error);
        throw new AppError("Failed to edit terminal", 500);
    }
}