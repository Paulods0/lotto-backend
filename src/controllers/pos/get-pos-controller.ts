import type { Request, Response } from "express"
import { idSchema } from "../../validations/@common/id.schema"
import { getPosService } from "../../services/pos/get-pos.service"

export async function getPosController(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params)

    const response = await getPosService(id)

    return res.status(200).json({
        data: response
    })
}