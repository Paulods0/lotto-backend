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
router.use("/pos", authenticate, posRouter)
router.use("/agents", authenticate, agentRouter)
router.use("/licences", authenticate, licenceRouter)
router.use("/terminals", authenticate, terminalRouter)

export default router