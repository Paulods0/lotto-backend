"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = createUserService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
async function createUserService(data) {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new errors_1.ConflictError('Já existe um usuário com este email.');
    }
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
    const user = await prisma_1.default.user.create({
        data: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
            password: hashedPassword,
        },
    });
    try {
        await (0, redis_1.deleteCache)('users:*');
    }
    catch (error) {
        console.warn('Erro ao limpar o redis', error);
    }
    return user.id;
}
