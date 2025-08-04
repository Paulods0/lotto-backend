"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const http_1 = require("../constants/http");
const errors_1 = require("../errors");
function errorHandler(err, req, res, next) {
    if (err instanceof errors_1.AppError) {
        console.error(`PATH: ${req.path} - METHOD: ${req.method}`, err);
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        console.error(`PATH: ${req.path} - METHOD: ${req.method}`, err);
        return res.status(http_1.HttpStatus.BAD_REQUEST).json({
            error: 'Dados inválidos',
            message: err.issues,
        });
    }
    console.error(`UNHANDLED ERRRO - PATH: ${req.path} - METHOD: ${req.method}`, err);
    return res.status(http_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno do servidor.',
    });
}
