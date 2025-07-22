import jwt from "jsonwebtoken";
import { AppError } from "../../errors/app-error";
import { AuthPayload } from "../../@types/auth-payload";
import { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";

// Função para extrair token do cookie
function getTokenFromCookie(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith("token="));

    if (!tokenCookie) return null;

    const [, token] = tokenCookie.split("=");

    return token || null;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
    const token = getTokenFromCookie(req.headers.cookie);

    if (!token) {
        throw new AppError("Token não fornecido", 401);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (
            typeof decoded === "object" &&
            decoded !== null &&
            "sub" in decoded &&
            "email" in decoded &&
            "role" in decoded
        ) {
            req.user = decoded as AuthPayload;
            next();
        } else {
            throw new Error("Token inválido.");
        }
    } catch (error) {
        throw new AppError("Token inválido ou expirado.", 401);
    }
}
