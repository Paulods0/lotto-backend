"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyProvincesService = fetchManyProvincesService;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const date_1 = require("../../utils/date");
async function fetchManyProvincesService() {
    const cacheKey = "provinces";
    try {
        const cached = await redis_1.default.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const provinces = await prisma_1.default.province.findMany({
            select: {
                id: true,
                name: true,
                cities: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (provinces.length > 0) {
            await redis_1.default.set(cacheKey, JSON.stringify(provinces), "EX", date_1.oneDayFromNowInMs);
        }
        return provinces;
    }
    catch (error) {
        console.error("Error on FecthManyProvincesService : ", error);
        throw error;
    }
}
