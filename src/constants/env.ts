import z from "zod";

const envSchema = z.object({
    JWT_ACCESS_TOKEN_SECRET:z.string(),
    JWT_REFRESH_TOKEN_SECRET:z.string(),
    JWT_EXPIRES_IN:z.string(),
    PORT:z.number().default(3333),
    DATABASE_URL:z.string(),
})

const parsed = envSchema.safeParse(process.env)

if(!parsed.success){
    console.log("Enviroment variables error: ", parsed.error)
    throw new Error("Enviroment variable is required: ", parsed.error)
}

const env = parsed.data

export default env