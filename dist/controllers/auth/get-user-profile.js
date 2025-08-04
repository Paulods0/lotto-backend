"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileController = getUserProfileController;
const redis_1 = __importDefault(require("../../lib/redis"));
async function getUserProfileController(req, res) {
    const user = req.user;
    const cacheKey = `profile:${user.id}`;
    const cached = await redis_1.default.get(cacheKey);
    if (cached) {
        return res.status(200).json({ user: JSON.parse(cached) });
    }
    // Guarda no Redis
    const exptime = 24 * 60 * 60; // 24h em segundos
    await redis_1.default.set(cacheKey, JSON.stringify(user), 'EX', exptime);
    return res.status(200).json({ user });
}
