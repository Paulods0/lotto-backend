import bcrypt from "bcrypt"
import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { CreateUserDTO } from "../../validations/user/create-user-schema";

export async function createUserService(data: CreateUserDTO) {
    try {

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } })

        if (existingUser) {
            throw new AppError("Já existe um usuário com este email.", 400)
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)

        const user = await prisma.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
                password: hashedPassword,
            }
        })

        const redisKeys = await redis.keys("users:*")

        if (redisKeys.length > 0) {
            await redis.del(...redisKeys)
        }

        return user.id

    } catch (error) {
        if (error instanceof AppError) {
            throw error; // ⚠️ repassa o erro original
        }

        console.error("Error on loginService: ", error);
        throw new AppError("Erro interno ao tentar logar.", 500);
    }
}