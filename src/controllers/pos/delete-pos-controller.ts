import type { Request, Response } from "express"
import { idSchema } from "../../validations/@common/id.schema"
import { deletePosService } from "../../services/pos/delete-pos.service"

export async function deletePosController(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params)

    await deletePosService(id)

    return res.status(200).json({
        message: "Pos removido com sucesso"
    })
}