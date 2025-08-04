"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAgentsService = fetchManyAgentsService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function fetchManyAgentsService(params) {
    const { limit, page, query = '', area_id, city_id, province_id, status, type_id, zone_id } = params;
    const cacheKey = keys_1.RedisKeys.agents.listWithFilters({
        limit,
        page,
        query: query || 'none',
        area_id,
        city_id,
        province_id,
        status,
        type_id,
        zone_id,
    });
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    let search = buildAgentsFilter(query);
    const where = {
        ...(search.length > 0 ? { OR: search } : {}),
        ...(typeof status !== 'undefined' ? { status } : {}),
        ...(typeof type_id !== 'undefined' ? { type_id } : {}),
        ...(typeof city_id !== 'undefined' ? { city_id } : {}),
        ...(typeof area_id !== 'undefined' ? { area_id } : {}),
        ...(typeof zone_id !== 'undefined' ? { zone_id } : {}),
        ...(typeof province_id !== 'undefined' ? { province_id } : {}),
    };
    const offset = (page - 1) * limit;
    const agents = await prisma_1.default.agent.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { created_at: 'asc' },
        select: {
            id: true,
            genre: true,
            status: true,
            terminal: true,
            last_name: true,
            first_name: true,
            id_reference: true,
            phone_number: true,
            afrimoney_number: true,
            area: { select: { id: true, name: true } },
            zone: { select: { id: true, number: true } },
            city: { select: { id: true, name: true } },
            province: { select: { id: true, name: true } },
            pos: {
                select: {
                    latitude: true,
                    longitude: true,
                    area: true,
                    zone: true,
                    type: true,
                    subtype: true,
                },
            },
        },
    });
    if (agents.length > 0) {
        await (0, redis_1.setCache)(cacheKey, agents);
    }
    return agents;
}
function buildAgentsFilter(query) {
    let search = [];
    if (!query?.trim())
        return search;
    search.push({ first_name: { contains: query, mode: 'insensitive' } }, { last_name: { contains: query, mode: 'insensitive' } }, { bi_number: { contains: query, mode: 'insensitive' } });
    const numberValue = Number(query);
    if (!isNaN(numberValue)) {
        search.push({ phone_number: { equals: numberValue } }, { afrimoney_number: { equals: numberValue } }, { id_reference: numberValue });
    }
    return search;
}
