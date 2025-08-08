"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fecthBoundedPos = fecthBoundedPos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function fecthBoundedPos(bounds) {
    const pos = await prisma_1.default.pos.findMany({
        where: {},
    });
    return pos;
}
