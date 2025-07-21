import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function seedData(){

    try {
        await prisma.administration.create({
            data:{
                name:"cassenda",
            }
        })
        console.log("Database seeded successfuly.")
    } catch (error) {
        console.error("Error while generate seed.")
    }

}

seedData()