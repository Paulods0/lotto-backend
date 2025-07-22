import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { ZodError } from "zod";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Dados inválidos",
            details: err.issues
        });
    }

    console.error("Erro não tratado:", err);

    return res.status(500).json({
        error: "Erro interno do servidor",
    });
}
