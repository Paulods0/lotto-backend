"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyLicencesService = fetchManyLicencesService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function fetchManyLicencesService({ limit, page, query = '', admin_id }) {
    const cacheKey = keys_1.RedisKeys.licences.listWithFilters({
        page,
        limit,
        admin_id,
        query: query || 'none',
    });
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const searchFilters = buildSearchFilters(query);
    const where = {
        ...(searchFilters.length ? { OR: searchFilters } : {}),
        ...(admin_id && { admin_id }),
    };
    const offset = (page - 1) * limit;
    const licences = await prisma_1.default.licence.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: 'asc' },
        select: {
            id: true,
            number: true,
            description: true,
            reference: true,
            creation_date: true,
            created_at: true,
            admin: { select: { id: true, name: true } },
        },
    });
    if (licences.length > 0) {
        await (0, redis_1.setCache)(cacheKey, licences);
    }
    return licences;
}
function buildSearchFilters(query) {
    const filters = [];
    filters.push({ description: { contains: query, mode: 'insensitive' } });
    filters.push({ number: { contains: query, mode: 'insensitive' } });
    filters.push({ reference: { contains: query, mode: 'insensitive' } });
    return filters;
}
