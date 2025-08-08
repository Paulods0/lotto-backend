"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyTerminals = fetchManyTerminals;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyTerminals(params) {
    const cacheKey = keys_1.RedisKeys.terminals.listWithFilters(params);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const filters = buildFilters(params.query);
    let start;
    let end;
    let isValidDate = false;
    if (params.delivery_date) {
        const parsedDate = new Date(params.delivery_date);
        isValidDate = !isNaN(parsedDate.getTime());
        if (isValidDate) {
            start = new Date(parsedDate);
            end = new Date(parsedDate);
            end.setDate(end.getDate() + 1);
        }
    }
    const where = {
        ...(filters.length > 0 && { OR: filters }),
        ...(params.area_id && { area_id: params.area_id }),
        ...(params.zone_id && { zone_id: params.zone_id }),
        ...(params.city_id && { city_id: params.city_id }),
        ...(params.agent_id && { agent_id: params.agent_id }),
        ...(params.province_id && { province_id: params.province_id }),
        ...(params.status && { status: params.status }),
        ...(isValidDate && {
            delivery_date: {
                gte: start,
                lt: end,
            },
        }),
    };
    const offset = (params.page - 1) * params.limit;
    const terminals = await prisma_1.default.terminal.findMany({
        where,
        take: params.limit,
        skip: offset,
        orderBy: { created_at: 'asc' },
        include: {
            city: true,
            area: true,
            zone: true,
            province: true,
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
    if (terminals.length > 0) {
        await (0, set_cache_1.setCache)(cacheKey, terminals);
    }
    return terminals;
}
function buildFilters(query) {
    const filters = [];
    if (!query)
        return filters;
    const numericQuery = Number(query);
    const isNumeric = !isNaN(numericQuery);
    filters.push({ serial: { contains: query, mode: 'insensitive' } });
    filters.push({ device_id: { contains: query, mode: 'insensitive' } });
    if (isNumeric) {
        filters.push({ pin: numericQuery }, { puk: numericQuery }, { sim_card: numericQuery }, { id_reference: numericQuery });
    }
    return filters;
}
