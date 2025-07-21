import type { Request, Response } from "express"
import { idSchema } from "../../validations/@common/id.schema"
import { deleteUserService } from "../../services/user/delete-user-service"

export async function deleteUserController(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params)

    await deleteUserService(id)

    return res.status(200).json({
        message: "Usuário removido com sucesso"
    })
}