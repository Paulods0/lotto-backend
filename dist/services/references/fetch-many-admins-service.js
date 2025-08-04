"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAdminsService = fetchManyAdminsService;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const date_1 = require("../../utils/date");
async function fetchManyAdminsService() {
    const cacheKey = "admins";
    try {
        const cached = await redis_1.default.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const admins = await prisma_1.default.administration.findMany({
            select: {
                id: true,
                name: true,
                licences: {
                    select: {
                        id: true,
                        reference: true,
                        creation_date: true
                    }
                }
            }
        });
        if (admins.length > 0) {
            await redis_1.default.set(cacheKey, JSON.stringify(admins), "EX", date_1.oneDayFromNowInMs);
        }
        return admins;
    }
    catch (error) {
        console.error("Error on FecthManyAdminsService : ", error);
        throw error;
    }
}
