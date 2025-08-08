"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyLicences = fetchManyLicences;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const client_1 = require("@prisma/client");
const set_cache_1 = require("../../utils/redis/set-cache");
const get_cache_1 = require("../../utils/redis/get-cache");
async function fetchManyLicences(params) {
    const cacheKey = keys_1.RedisKeys.licences.listWithFilters(params);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const searchFilters = buildFilters(params.query);
    const where = {
        ...(searchFilters.length ? { OR: searchFilters } : {}),
        ...(params.admin_id && { admin_id: params.admin_id }),
        ...(params.status && { status: params.status }),
    };
    const offset = (params.page - 1) * params.limit;
    const licences = await prisma_1.default.licence.findMany({
        where,
        skip: offset,
        take: params.limit,
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
    filters.push({ number: { contains: query, mode: 'insensitive' } });
    filters.push({ reference: { contains: query, mode: 'insensitive' } });
    filters.push({ coordinates: { contains: query, mode: 'insensitive' } });
    filters.push({ description: { contains: query, mode: 'insensitive' } });
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
