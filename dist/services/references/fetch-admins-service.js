"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAdmins = fetchManyAdmins;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyAdmins() {
    const cacheKey = keys_1.RedisKeys.admins.all();
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const admins = await prisma_1.default.administration.findMany({
        select: {
            id: true,
            name: true,
            licences: {
                select: {
                    id: true,
                    reference: true,
                    status: true,
                },
            },
        },
    });
    if (admins.length > 0)
        await (0, set_cache_1.setCache)(cacheKey, admins);
    return admins;
}
