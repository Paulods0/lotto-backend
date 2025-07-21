import isUUID from "../../lib/uuid";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditAgentDTO } from "../../validations/agent-schemas/edit-agent-schema";

export async function editAgentService(data: EditAgentDTO) {
    try {

        if (!isUUID(data.id)) throw new Error("ID inválido.")

        const agent = await prisma.agent.findUnique({ where: { id: data.id } })

        if (!agent) throw new Error("Agent não encontrado.")

        await prisma.agent.update({
            where: { id: data.id },
            data: {
                agent_type: data.type,
                first_name: data.first_name,
                last_name: data.last_name,
                genre: data.genre,
                afrimoney_number: data.afrimoney_number,
                bi_number: data.bi_number,
                status: data.status,
                phone_number: data.phone_number,
            }
        })

        return agent

    } catch (error) {
        console.error("Error in EditAgentService:", error);
        throw new AppError("Failed to edit agent", 500);
    }
}