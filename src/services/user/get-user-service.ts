import redis from "../../lib/redis"
import prisma from "../../lib/prisma"
import { AppError } from "../../errors/app-error"

export async function getUserService(id: string) {
    try {
        const cacheKey = `users:${id}`

        const existingUser = await prisma.user.findUnique({ where: { id } })

        const cached = await redis.get(cacheKey)

        if (cached) {
            return JSON.parse(cached)
        }

        if (!existingUser) {
            throw new AppError("Usuário não encontrado", 404)
        }

        const exptime = 60 * 5
        await redis.set(cacheKey, JSON.stringify(existingUser), "EX", exptime)

        return existingUser

    } catch (error) {
        console.error("Error on GetUserService: ", error)
        throw new AppError("Error while getting the user", 500)
    }
}