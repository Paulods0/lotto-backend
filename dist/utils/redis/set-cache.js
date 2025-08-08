"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = setCache;
const redis_1 = __importDefault(require("../../lib/redis"));
/**
 * Seta um valor no Redis com expiração
 */
async function setCache(key, value, seconds = 60 * 5) {
    try {
        await redis_1.default.set(key, JSON.stringify(value), 'EX', seconds);
    }
    catch (error) {
        console.error(`Erro ao setar cache [${key}] no Redis:`, error);
    }
}
