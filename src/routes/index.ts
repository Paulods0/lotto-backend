import { Router } from "express";
import posRouter from "./pos-routes";
import userRouter from "./user-routes";
import agentRouter from "./agent-routes";
import loginRouter from "./auth-router";
import licenceRouter from "./licence-routes";
import terminalRouter from "./terminal-routes";
import { authenticate } from "../middleware/auth/authenticate";

const router = Router()

router.use("/users", userRouter)
router.use("/auth", loginRouter)
router.use("/pos", posRouter)
router.use("/agents", agentRouter)
router.use("/licences", licenceRouter)
router.use("/terminals", terminalRouter)

export default router