import type { Request, Response } from "express"
import { createUserService } from "../../services/user/create-user-service"
import { createUserSchema } from "../../validations/user/create-user-schema"

export async function createUserController(req: Request, res: Response) {

    const body = createUserSchema.parse(req.body)
    const response = await createUserService(body)

    return res.status(201).json({
        message: "Usuário criado com sucesso.",
        data: response
    })
}