import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function seedData() {

    try {
        await prisma.province.createMany({
            data: [
                { name: "luanda"},
                { name: "benguela"},
                { name: "huambo"},
                { name: "malanje"},
                { name: "cunene"},
                { name: "moxico"},
                { name: "bié"},
                { name: "kwanza norte"},
                { name: "kwanza sul"},
                { name: "cuando cubango"},
                { name: "huíla"},
                { name: "uíge"},
                { name: "lunda norte"},
                { name: "lunda sul"},
                { name: "lunda sul"},
            ]
        })
        
        await prisma.area.createMany({
                data: [
                    { name: "a"},
                    { name: "b"},
                    { name: "c"},
                    { name: "d"},
                ]
            })

        console.log("Database seeded successfuly.")
    } catch (error) {
        console.error("Error while generate seed.")
    }

}

seedData()