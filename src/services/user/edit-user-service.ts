import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { EditUserDTO } from "../../validations/user/edit-user-schema";

export async function editUserService(data: EditUserDTO) {
    try {

        const existingUser = await prisma.user.findUnique({ where: { id: data.id } })

        if (!existingUser) {
            throw new AppError("O usuário não foi encontrado.", 404)
        }

        const updatedUser = await prisma.user.update({
            where: { id: data.id },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
            }
        })

        const redisKeys = await redis.keys("users:*")
        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return updatedUser.id

    } catch (error) {
        console.error("Error on EditUserService: ", error)
        throw new AppError("Error while editing user's info", 500)
    }
}