"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyPosService = fetchManyPosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
async function fetchManyPosService({ limit = 30, page = 1, query, type_id, city_id, area_id, zone_id, province_id, }) {
    const DEFAULT_LIMIT = limit;
    const DEFAULT_PAGE = page;
    const DEFAULT_QUERY = query?.trim() || 'none';
    const select = {
        id: true,
        id_reference: true,
        latitude: true,
        longitude: true,
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
    };
    const where = {
        ...(type_id && { type_id }),
        ...(city_id && { city_id }),
        ...(area_id && { area_id }),
        ...(zone_id && { zone_id }),
        ...(province_id && { province_id }),
    };
    if (query) {
        const numericQuery = Number(query);
        const searchConditions = [];
        if (!isNaN(numericQuery)) {
            searchConditions.push({ id_reference: numericQuery });
        }
        if (searchConditions.length > 0) {
            where.OR = searchConditions;
        }
    }
    const cacheKey = [
        'pos',
        `limit:${DEFAULT_LIMIT}`,
        `page:${DEFAULT_PAGE}`,
        `query:${DEFAULT_QUERY}`,
        type_id && `type:${type_id}`,
        city_id && `city:${city_id}`,
        area_id && `area:${area_id}`,
        zone_id && `zone:${zone_id}`,
        province_id && `province:${province_id}`,
    ]
        .filter(Boolean)
        .join(':');
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const orderBy = { created_at: 'asc' };
    const offset = (DEFAULT_PAGE - 1) * DEFAULT_LIMIT;
    const pos = await prisma_1.default.pos.findMany({
        where,
        skip: offset,
        take: DEFAULT_LIMIT,
        orderBy,
        select,
    });
    if (pos.length > 0) {
        await (0, redis_1.setCache)(cacheKey, pos);
    }
    return pos;
}
