import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import router from "./routes"
import { errorHandler } from "./middleware/error-handler"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.use("/api", router)

app.use(errorHandler)

app.get("/", async (req, res) => {
    res.send("Hello from the server")
})

app.listen(3333, () => {
    console.log("App running on port:3333")
})

export default app