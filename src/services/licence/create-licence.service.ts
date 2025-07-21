import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreateLicenceDTO } from "../../validations/licence-schemas/create-licence-schema";


export async function createLicenceService(data: CreateLicenceDTO) {
    try {
        const admin = await prisma.administration.findUnique({ where: { id: data.admin_id } })
        
        if(!admin){
            throw new AppError("A administração não foi encontrada.", 404)
        }

        const licence_year = data.creation_date?.getFullYear() ?? new Date().getFullYear()

        const licence_ref = `${admin.name}-N${data.number}-${licence_year}-PT${data.description}`

        const licence = await prisma.licence.create({
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
        console.error("Error in createLicenceService:", error);
        throw new AppError("Failed to create Licence", 500);
    }
}