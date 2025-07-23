import { Router } from "express";
import posRouter from "./pos-routes";
import userRouter from "./user-routes";
import agentRouter from "./agent-routes";
import loginRouter from "./auth-router";
import licenceRouter from "./licence-routes";
import terminalRouter from "./terminal-routes";
// import { authenticate } from "../middleware/auth/authenticate";
import { adminRoutes, areasRoutes, provincesRoutes, typesRoutes } from "./other-routes";

const router = Router()

router.use("/users", userRouter)
router.use("/auth", loginRouter)
router.use("/pos", posRouter)
router.use("/agents", agentRouter)
router.use("/licences", licenceRouter)
router.use("/terminals", terminalRouter)

// Other routers
router.use("/admins", adminRoutes)
router.use("/types", typesRoutes)
router.use("/areas", areasRoutes)
router.use("/provinces", provincesRoutes)

export default router