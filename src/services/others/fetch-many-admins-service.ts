import redis from "../../lib/redis"
import prisma from "../../lib/prisma"
import { oneDayFromNowInMs } from "../../utils/date"

export async function fetchManyAdminsService (){
    const cacheKey = "admins"
    try {
        const cached = await redis.get(cacheKey)
        if(cached) return JSON.parse(cached)

        const admins = await prisma.administration.findMany({
            select:{ 
                id:true,
                name:true,
                licences:{
                    select:{
                        id:true,
                        reference:true,
                        creation_date:true
                    }
                }
             }
        })

        if(admins.length > 0){
            await redis.set(cacheKey, JSON.stringify(admins), "EX", oneDayFromNowInMs)
        }

        return admins
    } catch (error) {
        console.error("Error on FecthManyAdminsService : ", error)
        throw error
    }
}