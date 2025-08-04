"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyTerminalsService = fetchManyTerminalsService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/cache-keys/keys");
const redis_1 = require("../../utils/redis");
async function fetchManyTerminalsService(params) {
    const { limit, page, query = '', area_id, city_id, province_id, zone_id } = params;
    const cacheKey = keys_1.RedisKeys.terminals.listWithFilters({
        limit,
        page,
        query: query || 'none',
        area_id,
        zone_id,
        province_id,
        city_id,
    });
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const searchFilters = buildSearchFilters(query);
    const where = {
        ...(searchFilters.length > 0 ? { OR: searchFilters } : {}),
        ...(area_id && { area_id }),
        ...(zone_id && { zone_id }),
        ...(city_id && { city_id }),
        ...(province_id && { province_id }),
    };
    const offset = (page - 1) * limit;
    const terminals = await prisma_1.default.terminal.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { created_at: 'asc' },
        select: {
            id: true,
            pin: true,
            puk: true,
            serial: true,
            status: true,
            sim_card: true,
            id_reference: true,
            city: { select: { id: true, name: true } },
            area: { select: { id: true, name: true } },
            zone: { select: { id: true, number: true } },
            province: { select: { id: true, name: true } },
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
    // Cache apenas se houver resultados
    if (terminals.length > 0) {
        await (0, redis_1.setCache)(cacheKey, terminals);
    }
    return terminals;
}
function buildSearchFilters(query) {
    const filters = [];
    if (!query)
        return filters;
    const numericQuery = Number(query);
    const isNumeric = !isNaN(numericQuery);
    // Pesquisa por serial, sim_card e id_reference como string ou número
    filters.push({ serial: { contains: query, mode: 'insensitive' } });
    // Caso seja um número, adiciona correspondência exata
    if (isNumeric) {
        filters.push({ pin: numericQuery }, { puk: numericQuery }, { sim_card: numericQuery }, { id_reference: numericQuery });
    }
    // Filtro por status booleano
    if (query === 'true' || query === 'false') {
        filters.push({ status: query === 'true' });
    }
    return filters;
}
