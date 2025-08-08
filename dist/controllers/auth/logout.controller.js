"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const http_1 = require("../../constants/http");
const redis_1 = __importDefault(require("../../lib/redis"));
async function handle(req, res) {
    res.clearCookie('refreshToken');
    const userId = req.user?.id;
    if (userId) {
        const cacheKey = `profile:${userId}`;
        const cached = await redis_1.default.get(cacheKey);
        if (cached) {
            await redis_1.default.del(cacheKey);
        }
    }
    req.user = undefined;
    return res.status(http_1.HttpStatus.OK).json({ message: 'Logout realizado com sucesso.' });
}
