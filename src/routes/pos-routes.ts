import { Router } from "express";

import { getPosController } from "../controllers/pos/get-pos-controller";
import { editPosController } from "../controllers/pos/edit-pos-controller";
import { deletePosController } from "../controllers/pos/delete-pos-controller";
import { createPosController } from "../controllers/pos/create-pos-controller";
import { fetchManyPosController } from "../controllers/pos/fetch-many-pos-controller";

const posRouter = Router()

posRouter.post("/", createPosController)
posRouter.put("/:id", editPosController)
posRouter.delete("/:id", deletePosController)
posRouter.get("/:id", getPosController)
posRouter.get("/", fetchManyPosController)

export default posRouter