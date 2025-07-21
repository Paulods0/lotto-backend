import { Router } from "express";
import { loginController } from "../controllers/auth/login-controller";

const loginRouter = Router()

loginRouter.post("/login", loginController)

export default loginRouter