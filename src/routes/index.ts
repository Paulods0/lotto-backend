import { Router } from "express";
import posRouter from "./pos-routes";
import userRouter from "./user-routes";
import agentRouter from "./agent-routes";
import terminalRouter from "./terminal-routes";
import loginRouter from "./auth-router";
import { authenticate } from "../middleware/auth/authenticate";

const router = Router()

router.use("/pos", authenticate, posRouter)
router.use("/users", authenticate, userRouter)
router.use("/auth", loginRouter)
router.use("/agents", authenticate, agentRouter)
router.use("/terminals", authenticate, terminalRouter)

export default router