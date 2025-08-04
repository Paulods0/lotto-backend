"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../constants/env"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
async function loginService(data) {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!existingUser)
        throw new errors_1.BadRequestError('Credenciais inválidas.');
    const isSamePassword = await bcrypt_1.default.compare(data.password, existingUser.password);
    if (!isSamePassword) {
        throw new errors_1.BadRequestError('Credenciais inválidas.');
    }
    const user = {
        name: `${existingUser.first_name} ${existingUser.last_name}`,
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(user, env_1.default.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign(user, env_1.default.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}
