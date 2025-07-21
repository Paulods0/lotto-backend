import { Router } from "express";
import { loginController } from "../controllers/auth/login-controller";
import { logoutController } from "../controllers/auth/logout-controller";

const loginRouter = Router()

loginRouter.post("/login", loginController)
loginRouter.get("/logout", logoutController)

export default loginRouter