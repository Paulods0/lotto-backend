import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditTerminalDTO } from "../../validations/terminal-schemas/edit-terminal-schema";

export async function editTerminalService(data: EditTerminalDTO) {
    let id_reference  = data.id_reference

    try {
        if(data.agent_id){
            const agent = await prisma.agent.findUnique({ where:{ id: data.agent_id } })
            id_reference = agent?.id_reference ?? undefined
        }

        const terminal = await prisma.terminal.findUnique({ where: { id: data.id } })

        if (!terminal) throw new Error("Terminal não encontrado.")

        await prisma.terminal.update({
            where: { id: data.id },
            data: {
                id_reference,
                pin: data.pin,
                puk: data.puk,
                status: data.status,
                serial: data.serial,
                sim_card: data.sim_card,
                ...(data.agent_id && { agent: { connect:{ id: data.agent_id } } })
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