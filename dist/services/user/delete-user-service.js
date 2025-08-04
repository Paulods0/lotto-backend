"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = deleteUserService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function deleteUserService(id) {
    const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new errors_1.NotFoundError('Usuário não econtrado.');
    }
    await prisma_1.default.user.delete({
        where: { id },
    });
    try {
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.users.all());
    }
    catch (error) {
        console.warn('Erro ao limpar o redis', error);
    }
}
