"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdReference = generateIdReference;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function generateIdReference(agentType) {
    try {
        const id_reference = await prisma_1.default.idReference.update({
            where: { type: agentType },
            data: {
                counter: { increment: 1 },
            },
        });
        return id_reference.counter;
    }
    catch (error) {
        throw error;
    }
}
