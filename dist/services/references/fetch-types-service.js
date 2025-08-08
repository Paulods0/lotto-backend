"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyTypes = fetchManyTypes;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const date_1 = require("../../utils/date");
async function fetchManyTypes() {
    const cacheKey = 'types';
    try {
        const cached = await redis_1.default.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const types = await prisma_1.default.type.findMany({
            select: {
                id: true,
                name: true,
                subtypes: { select: { id: true, name: true, type_id: true } },
            },
        });
        if (types.length > 0) {
            await redis_1.default.set(cacheKey, JSON.stringify(types), 'EX', date_1.oneDayFromNowInMs);
        }
        return types;
    }
    catch (error) {
        console.error('Error on FecthManyTypesService : ', error);
        throw error;
    }
}
