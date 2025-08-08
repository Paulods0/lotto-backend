"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyPos = fetchManyPos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyPos(params) {
    const cacheKey = keys_1.RedisKeys.pos.listWithFilters(params);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const filters = buildFilters(params.query);
    const where = {
        ...(filters?.length ? { OR: filters } : {}),
        ...(params.type_id && { type_id: params.type_id }),
        ...(params.city_id && { city_id: params.city_id }),
        ...(params.area_id && { area_id: params.area_id }),
        ...(params.zone_id && { zone_id: params.zone_id }),
        ...(params.subtype_id && { type_id: params.subtype_id }),
        ...(params.subtype_id && { subtype_id: params.subtype_id }),
        ...(params.province_id && { province_id: params.province_id }),
    };
    const offset = (params.page - 1) * params.limit;
    const pos = await prisma_1.default.pos.findMany({
        where,
        skip: offset,
        take: params.limit,
        orderBy: { created_at: 'asc' },
        select: {
            id: true,
            id_reference: true,
            coordinates: true,
            type: true,
            subtype: true,
            admin: true,
            province: true,
            area: true,
            zone: true,
            city: true,
            licence: true,
            agent: {
                select: {
                    id: true,
                    id_reference: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });
    if (pos.length > 0) {
        await (0, set_cache_1.setCache)(cacheKey, pos);
    }
    return pos;
}
function buildFilters(query) {
    const filters = [];
    const numericQuery = Number(query);
    if (!query?.trim())
        return filters;
    filters.push({
        coordinates: { contains: query },
    });
    if (!isNaN(numericQuery)) {
        filters.push({ id_reference: numericQuery });
    }
    return filters;
}
