import { Router } from "express";

import { getLicenceController } from "../controllers/licence/get-licence-controller";
import { editLicenceController } from "../controllers/licence/edit-licence-controller";
import { createLicenceController } from "../controllers/licence/create-licence-controller";
import { deleteLicenceController } from "../controllers/licence/delete-licence-controller";
import { fetchManyLicencesController } from "../controllers/licence/fetch-many-licences-controller";

const licenceRouter = Router()

licenceRouter.post("/", createLicenceController)
licenceRouter.put("/:id", editLicenceController)
licenceRouter.delete("/:id", deleteLicenceController)
licenceRouter.get("/:id", getLicenceController)
licenceRouter.get("/", fetchManyLicencesController)

export default licenceRouter