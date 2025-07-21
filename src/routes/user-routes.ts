import { Router } from "express";

import { getUserController } from "../controllers/user/get-user-controller";
import { editUserController } from "../controllers/user/edit-user-controller";
import { createUserController } from "../controllers/user/create-user-controller";
import { deleteUserController } from "../controllers/user/delete-user-controller";
import { fetchManyUsersController } from "../controllers/user/fetch-many-users-controller";

const userRouter = Router()

userRouter.post("/", createUserController)
userRouter.put("/:id", editUserController)
userRouter.delete("/:id", deleteUserController)
userRouter.get("/:id", getUserController)
userRouter.get("/", fetchManyUsersController)

export default userRouter