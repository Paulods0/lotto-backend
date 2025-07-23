import { Router } from "express";

import { getTerminalController } from "../controllers/terminal/get-terminal-controller";
import { editTerminalController } from "../controllers/terminal/edit-terminal-controller";
import { createTerminalController } from "../controllers/terminal/create-terminal-controller";
import { deleteTerminalController } from "../controllers/terminal/delete-terminal-controller";
import { fetchManyTerminalsController } from "../controllers/terminal/fetch-many-terminals-controller";
import { deleteManyTerminalsController } from "../controllers/terminal/delete-many-terminals-controller";

const terminalRouter = Router()

terminalRouter.post("/", createTerminalController)
terminalRouter.put("/:id", editTerminalController)

terminalRouter.delete("/bulk", deleteManyTerminalsController)
terminalRouter.delete("/:id", deleteTerminalController)

terminalRouter.get("/", fetchManyTerminalsController)
terminalRouter.get("/:id", getTerminalController)

export default terminalRouter