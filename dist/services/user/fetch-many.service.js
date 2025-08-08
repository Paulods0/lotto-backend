"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyUsers = fetchManyUsers;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyUsers(params) {
    const cacheKey = keys_1.RedisKeys.users.listWithFilters(params);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const search = buildFilters(params.query);
    let where = {
        AND: [{ OR: search }, { role: { in: ['area_manager', 'dev', 'super_admin', 'supervisor'] } }],
    };
    const offset = (params.page - 1) * params.limit;
    const users = await prisma_1.default.user.findMany({
        where,
        take: params.limit,
        skip: offset,
        orderBy: { created_at: 'asc' },
    });
    if (users.length > 0)
        await (0, set_cache_1.setCache)(cacheKey, users);
    return users;
}
function buildFilters(query) {
    let filters = [];
    if (!query)
        return filters;
    filters.push({ email: { contains: query, mode: 'insensitive' } });
    filters.push({ last_name: { contains: query, mode: 'insensitive' } });
    filters.push({ first_name: { contains: query, mode: 'insensitive' } });
    return filters;
}
