import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditLicenceDTO } from "../../validations/licence-schemas/edit-licence-schema";

export async function editLicenceService(data: EditLicenceDTO) {
    try {

        const admin = await prisma.administration.findUnique({ where: { id: data.admin_id } })
        if(!admin) throw new AppError("A administração não foi encontrada.", 404)

        const licence = await prisma.licence.findUnique({ include: { admin: true } ,where: { id: data.id } })
        if (!licence) throw new Error("licence não encontrado.")

        const adminName = admin.name ?? licence.admin.name 
        const licenceNumber = data.number ?? licence.number 
        const licenceDesc = data.description ?? licence.description
        const licence_year = data.creation_date?.getFullYear() ?? licence.created_at.getFullYear()
        
        const licence_ref = `${adminName}-N${licenceNumber}-${licence_year}-PT${licenceDesc}`

        await prisma.licence.update({
            where: { id: data.id },
            data: {
                file:data.file,
                number:data.number,
                description:data.description,
                creation_date:data.creation_date,
                reference:licence_ref.toUpperCase(),
                admin: { connect: { id: data.admin_id } }
            }
        })

        const redisKeys = await redis.keys("licences:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return licence.id

    } catch (error) {
        console.error("Error in EditlicenceService:", error);
        throw new AppError("Failed to edit licence", 500);
    }
}