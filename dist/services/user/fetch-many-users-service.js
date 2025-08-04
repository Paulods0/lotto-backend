"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyUsersService = fetchManyUsersService;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function fetchManyUsersService({ limit = 30, page, query }) {
    const exptime = 60 * 5;
    const DEFAULT_LIMIT = limit ?? 30;
    const DEFAULT_PAGE = page ?? 1;
    const DEFAULT_QUERY = query?.trim() ?? 'none';
    const cacheKey = `users:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
    const cached = await redis_1.default.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    const orderBy = { created_at: 'asc' };
    let where = undefined;
    if (query) {
        const searchConditions = [];
        searchConditions.push({ first_name: { contains: query, mode: 'insensitive' } });
        searchConditions.push({ last_name: { contains: query, mode: 'insensitive' } });
        searchConditions.push({ email: { contains: query, mode: 'insensitive' } });
        where = {
            AND: [
                {
                    OR: searchConditions,
                },
                {
                    role: { in: ['area_manager', 'dev', 'super_admin', 'supervisor'] },
                },
            ],
        };
    }
    if (typeof page === 'undefined') {
        const users = await prisma_1.default.user.findMany({ where, orderBy });
        await redis_1.default.set(cacheKey, JSON.stringify(users), 'EX', exptime);
        return users;
    }
    const offset = (DEFAULT_PAGE - 1) * limit;
    const users = await prisma_1.default.user.findMany({
        where,
        skip: offset,
        take: DEFAULT_LIMIT,
        orderBy,
    });
    if (users.length > 0) {
        await redis_1.default.set(cacheKey, JSON.stringify(users), 'EX', exptime);
    }
    return users;
}
