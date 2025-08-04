"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = logoutController;
const http_1 = require("../../constants/http");
const redis_1 = __importDefault(require("../../lib/redis"));
async function logoutController(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(http_1.HttpStatus.UNAUTHORIZED).json({ message: 'Não autorizado.' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(http_1.HttpStatus.BAD_REQUEST).json({ message: 'Token malformado.' });
    }
    const token = parts[1];
    if (!token) {
        return res.status(http_1.HttpStatus.BAD_REQUEST).json({ message: 'Token não fornecido.' });
    }
    // Limpa o cookie de refresh token (caso use)
    res.clearCookie('refreshToken');
    // Remove o perfil do Redis (ou outros dados de sessão)
    const cached = await redis_1.default.get('profile');
    if (cached) {
        await redis_1.default.del('profile');
    }
    // Limpa req.user, se quiser garantir que os dados do usuário não fiquem disponíveis
    req.user = undefined;
    return res.status(http_1.HttpStatus.OK).json({ message: 'Logout realizado com sucesso.' });
}
