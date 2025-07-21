import type { Request, Response } from "express"
import { createPosService } from "../../services/pos/create-pos.service"
import { createPosSchema } from "../../validations/pos-schemas/create-pos-schema"

export async function createPosController(req: Request, res: Response) {

    const body = createPosSchema.parse(req.body)
    const response = await createPosService(body)

    return res.status(201).json({
        message: "Pos criado com sucesso",
        data: response
    })
}