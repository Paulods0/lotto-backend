import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import prisma from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { loginDTO } from "../../validations/auth/login-schema"

export async function loginService(data: loginDTO) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!existingUser) throw new AppError("Credenciais inválidas.", 400)

        const isSamePassword = await bcrypt.compare(data.password, existingUser.password)

        if (!isSamePassword) {
            throw new AppError("Credenciais inválidas.", 400)
        }

        const token = jwt.sign(
            {
                sub: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
            },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { token }
    
    } catch (error) {
        if (error instanceof AppError) {
            throw error; // ⚠️ repassa o erro original
        }

        console.error("Error on loginService: ", error);
        throw new AppError("Erro interno ao tentar logar.", 500);
    }
}