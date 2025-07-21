import redis from "../../lib/redis"
import prisma from "../../lib/prisma"
import { AppError } from "../../errors/app-error"

export async function deleteUserService(id: string) {
    try {

        const existingUser = await prisma.user.findUnique({ where: { id } })
        if (!existingUser) {
            throw new AppError("Usuário não econtrado.", 404)
        }

        await prisma.user.delete({
            where: { id }
        })

        const redisKeys = await redis.keys("users:*")

        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

    } catch (error) {
        console.error("Error on RemoveUserService: ", error)
        throw new AppError("Error while removing user", 500)
    }
}