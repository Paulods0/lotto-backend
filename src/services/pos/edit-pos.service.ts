import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditPosDTO } from "../../validations/pos-schemas/edit-pos-schema";

export async function editPosService(data: EditPosDTO) {
    let id_reference: number | null = data.id_reference ?? null;

    try {
        let agentData = undefined;

        if (data.agent_id) {
            const agent = await prisma.agent.findUnique({ where: { id: data.agent_id } });
            id_reference = agent?.id_reference ?? null;
            agentData = { connect: { id: data.agent_id } };

            if (id_reference !== null) {
                // Verificar se já existe um POS com esse id_reference (excluindo o atual)
                const existingPos = await prisma.pos.findFirst({
                    where: {
                        id_reference,
                        NOT: { id: data.id }
                    }
                });

                // Se existir, removemos o id_reference dele
                if (existingPos) {
                    await prisma.pos.update({
                        where: { id: existingPos.id },
                        data: { id_reference: null }
                    });
                }
            }
        } else {
            id_reference = null;
            agentData = { disconnect: true };
        }

        const pos = await prisma.pos.findUnique({ where: { id: data.id } });
        if (!pos) throw new Error("Pos não encontrado.");

        await prisma.pos.update({
            where: { id: data.id },
            data: {
                id_reference,
                latitude: data.latitude,
                longitude: data.longitude,
                agent: agentData,
                ...(data.licence_id && { licence: { connect: { id: data.licence_id } } }),
            }
        });

        const redisKeys = await redis.keys("pos:*");
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys);
        }

        return pos.id;

    } catch (error) {
        console.error("Error in EditPosService:", error);
        throw new AppError("Failed to edit pos", 500);
    }
}
