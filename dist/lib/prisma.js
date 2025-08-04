"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["error", "info"]
});
const checkConnection = async () => {
    try {
        await prisma.$connect();
        console.info("Prisma Connected succesfully`");
    }
    catch (error) {
        console.error("Error While Connecting Prisma");
    }
};
checkConnection();
exports.default = prisma;
