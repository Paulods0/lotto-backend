"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserService = editUserService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
async function editUserService(data) {
    const existingUser = await prisma_1.default.user.findUnique({ where: { id: data.id } });
    if (!existingUser) {
        throw new errors_1.NotFoundError('Usuário não encontrado.');
    }
    const updatedUser = await prisma_1.default.user.update({
        where: { id: data.id },
        data: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
        },
    });
    try {
        await (0, redis_1.deleteCache)('users:*');
    }
    catch (error) {
        console.warn('Erro ao limpar o redis', error);
    }
    return updatedUser.id;
}
