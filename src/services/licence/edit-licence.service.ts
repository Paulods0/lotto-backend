import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditLicenceDTO } from "../../validations/licence-schemas/edit-licence-schema";

export async function updateLicenceService(data: EditLicenceDTO) {
    try {
        if (!data.id) throw new AppError("ID da licença não fornecido.", 400);

        const [licence, admin] = await Promise.all([
            prisma.licence.findUnique({
                where: { id: data.id },
                include: { admin: true },
            }),
            data.admin_id
                ? prisma.administration.findUnique({
                    where: { id: data.admin_id },
                }) : Promise.resolve(undefined),
        ]);


        if (!licence) throw new AppError("licence não encontrado.", 404)

        const number = data.number ?? licence.number
        const description = data.description ?? licence.description
        const creation_date = data.creation_date?.getFullYear() ?? licence.created_at.getFullYear()
        const adminName = admin?.name ?? licence.admin?.name
        const reference = `${adminName ?? "unknown"}-N${number}-${creation_date}-PT${description}`.toUpperCase();

        await prisma.licence.update({
        where: { id: data.id },
        data: {
            reference,
            number: data.number,
            description: data.description,
            creation_date: data.creation_date,
            ...(data.file && { file: data.file }),
            ...(data.admin_id && { admin: { connect: { id: data.admin_id } } }),
        },
        });

        const redisKeys = await redis.keys("licences:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
            await redis.del("admins")
        }

        return licence.id

    } catch (error) {
        console.error("Error in updateLicenceService:", error);
        throw new AppError("Failed to edit licence", 500);
    }
}