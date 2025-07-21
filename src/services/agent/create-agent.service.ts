import { AppError } from "../../errors/app-error";
import prisma from "../../lib/prisma";
import { generateIdReference } from "../../utils/generate-id-reference";
import { CreateAgentDTO } from "../../validations/agent-schemas/create-agent-schema";

export async function createAgentService(data: CreateAgentDTO) {
    try {
        const id_reference = await generateIdReference(data.type)
        const agent = await prisma.agent.create({
            data: {
                id_reference,
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
        console.error("Error in createAgentService:", error);
        throw new AppError("Failed to create agent", 500);
    }
}