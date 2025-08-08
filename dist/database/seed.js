"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedData() {
    try {
        await prisma.user.create({
            data: {
                first_name: 'Paulo',
                last_name: 'Luguenda',
                email: 'p.luguenda@lotarianacional.co.ao',
                role: 'dev',
                password: '$2b$10$HbFNTplNBzOV61HbtVFTSu2D5Z5pjk.x.oSUYaonmH77lWbqqZX9e',
            },
        });
        console.log('Database seeded successfuly.');
    }
    catch (error) {
        console.error('Error while generate seed.');
    }
    finally {
        prisma.$disconnect();
    }
}
seedData();
