import { Router } from "express";

import { getAgentController } from "../controllers/agent/get-agent-controller";
import { editAgentController } from "../controllers/agent/edit-agent-controller";
import { createAgentController } from "../controllers/agent/create-agent-controller";
import { fetchManyAgentsController } from "../controllers/agent/fetch-many-agents-controller";

const agentRouter = Router()

agentRouter.post("/", createAgentController)
agentRouter.put("/:id", editAgentController)
agentRouter.get("/:id", getAgentController)
agentRouter.get("/", fetchManyAgentsController)

export default agentRouter