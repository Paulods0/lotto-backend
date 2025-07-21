import jwt from "jsonwebtoken";
import { AppError } from "../../errors/app-error";
import { AuthPayload } from "../../@types/auth-payload";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret"

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Token não fornecido", 401)
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (
            typeof decoded === "object"
            && decoded !== null
            && "sub" in decoded
            && "email" in decoded
            && "role" in decoded
        ) {
            req.user = decoded as AuthPayload
            next()
        } else {
            throw new Error("Token inválido.")
        }
    } catch (error) {
        throw new AppError("Token inválido ou expirado.", 401)
    }
}