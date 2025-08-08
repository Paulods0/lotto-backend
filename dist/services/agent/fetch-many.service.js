"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAgents = fetchManyAgents;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const keys_1 = require("../../utils/redis/keys");
const client_1 = require("@prisma/client");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyAgents(params) {
    const cacheKey = keys_1.RedisKeys.agents.listWithFilters(params);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    let search = buildFilters(params.query);
    let start;
    let end;
    let isValidDate = false;
    if (params.training_date) {
        const parsedDate = new Date(params.training_date);
        isValidDate = !isNaN(parsedDate.getTime());
        if (isValidDate) {
            start = new Date(parsedDate);
            end = new Date(parsedDate);
            end.setDate(end.getDate() + 1);
        }
    }
    const where = {
        ...(search.length > 0 ? { OR: search } : {}),
        ...(params.type_id && { type_id: params.type_id }),
        ...(params.city_id && { city_id: params.city_id }),
        ...(params.area_id && { area_id: params.area_id }),
        ...(params.zone_id && { zone_id: params.zone_id }),
        ...(params.status && { status: params.status }),
        ...(params.province_id && { province_id: params.province_id }),
        training_date: {
            gte: start,
            lt: end,
        },
    };
    const offset = (params.page - 1) * params.limit;
    const agents = await prisma_1.default.agent.findMany({
        where,
        take: params.limit,
        skip: offset,
        orderBy: { created_at: 'asc' },
        include: {
            terminal: true,
            area: { select: { id: true, name: true } },
            zone: { select: { id: true, number: true } },
            city: { select: { id: true, name: true } },
            province: { select: { id: true, name: true } },
            pos: {
                select: {
                    coordinates: true,
                    area: true,
                    zone: true,
                    type: true,
                    subtype: true,
                    licence: {
                        select: {
                            reference: true,
                        },
                    },
                },
            },
        },
    });
    if (agents.length > 0) {
        await (0, set_cache_1.setCache)(cacheKey, agents);
    }
    return agents;
}
function buildFilters(query) {
    let filters = [];
    const numberValue = Number(query);
    if (!query?.trim())
        return filters;
    if (Object.values(client_1.AgentStatus).includes(query.toLowerCase())) {
        filters.push({
            status: { equals: query.toLowerCase() },
        });
    }
    filters.push({ bi_number: { contains: query, mode: 'insensitive' } }, { last_name: { contains: query, mode: 'insensitive' } }, { first_name: { contains: query, mode: 'insensitive' } });
    if (!isNaN(numberValue)) {
        filters.push({ phone_number: { equals: numberValue } }, { afrimoney_number: { equals: numberValue } }, { id_reference: numberValue });
    }
    return filters;
}
