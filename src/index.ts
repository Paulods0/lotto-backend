import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import router from "./routes"
import env from "./config/env"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/error-handler"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.use("/api", router)

app.use(errorHandler)

app.listen(env.PORT, () => {
    console.log(`App running on port:${env.PORT}`)
})

export default app