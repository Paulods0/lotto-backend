"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyLicences = fetchManyLicences;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
const keys_1 = require("../../utils/redis/keys");
const set_cache_1 = require("../../utils/redis/set-cache");
const get_cache_1 = require("../../utils/redis/get-cache");
async function fetchManyLicences({ limit, page, query = '', admin_id }) {
    const cacheKey = keys_1.RedisKeys.licences.listWithFilters({
        page,
        limit,
        admin_id,
        query: query || 'none',
    });
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const searchFilters = buildFilters(query);
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
            limit: true,
            status: true,
            coordinates: true,
            admin_id: true,
            creation_date: true,
            expires_at: true,
            created_at: true,
            admin: { select: { id: true, name: true } },
        },
    });
    if (licences.length > 0) {
        await (0, set_cache_1.setCache)(cacheKey, licences);
    }
    return licences;
}
function buildFilters(query) {
    const filters = [];
    console.log('Status :', query);
    filters.push({ description: { contains: query, mode: 'insensitive' } });
    filters.push({ number: { contains: query, mode: 'insensitive' } });
    filters.push({ reference: { contains: query, mode: 'insensitive' } });
    filters.push({ coordinates: { contains: query, mode: 'insensitive' } });
    const lowerQuery = query.toLowerCase();
    if (Object.values(client_1.LicenceStatus).includes(query.toLowerCase())) {
        filters.push({
            status: { equals: query.toLowerCase() },
        });
    }
    const parsedDate = new Date(query);
    if (!isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate);
        const end = new Date(parsedDate);
        end.setDate(end.getDate() + 1);
        filters.push({
            creation_date: {
                gte: start,
                lt: end,
            },
        });
    }
    return filters;
}
