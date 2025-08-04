"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fecthBoundedPosService = fecthBoundedPosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function fecthBoundedPosService(bounds) {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    const pos = await prisma_1.default.pos.findMany({
        where: {
            latitude: { gte: parseFloat(minLat), lte: parseFloat(maxLat) },
            longitude: { gte: parseFloat(minLng), lte: parseFloat(maxLng) },
        },
    });
    return pos;
}
