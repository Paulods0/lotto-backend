"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAreas = fetchManyAreas;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const date_1 = require("../../utils/date");
async function fetchManyAreas() {
    const cacheKey = "areas";
    try {
        const cached = await redis_1.default.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const areas = await prisma_1.default.area.findMany({
            select: { id: true, name: true, zones: { select: { id: true, number: true } } }
        });
        if (areas.length > 0) {
            await redis_1.default.set(cacheKey, JSON.stringify(areas), "EX", date_1.oneDayFromNowInMs);
        }
        return areas;
    }
    catch (error) {
        console.error("Error on FecthManyAreasService : ", error);
        throw error;
    }
}
