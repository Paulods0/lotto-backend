import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function seedData() {

    try {
        await prisma.idReference.createMany({
            data: [
                { counter: 1000, type: "revendedor" },
                { counter: 9000, type: "lotaria_nacional" },
            ]
        })
        console.log("Database seeded successfuly.")
    } catch (error) {
        console.error("Error while generate seed.")
    }

}

seedData()