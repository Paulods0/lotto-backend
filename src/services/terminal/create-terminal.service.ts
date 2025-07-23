import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreateTerminalDTO } from "../../validations/terminal-schemas/create-terminal-schema";

export async function createTerminalService(data: CreateTerminalDTO) {
    let id_reference = undefined

    try {
        
        if(data.agent_id){
            const agent = await prisma.agent.findUnique({ where: { id: data.agent_id } })
            id_reference = agent?.id_reference

            if(id_reference){
                const existingTerminal = await prisma.terminal.findFirst({ where:{ id_reference }})
                
                if(existingTerminal){
                    await prisma.terminal.update({
                        where: {id: existingTerminal.id },
                        data:{ id_reference: null }
                    })
                }
            }
        }

        const terminal = await prisma.terminal.create({
            data: {
                id_reference,
                pin: data.pin,
                puk: data.puk,
                serial: data.serial,
                sim_card: data.sim_card,
                ...(data.agent_id && { agent: { connect:{ id: data.agent_id } } }),
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