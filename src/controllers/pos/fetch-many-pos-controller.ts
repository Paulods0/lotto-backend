import type { Request, Response } from "express"
import { paramsSchema } from "../../validations/@common/query.schema"
import { fetchManyPosService } from "../../services/pos/fetch-many-pos.service"

export async function fetchManyPosController(req: Request, res: Response) {
    const { limit, page, query } = paramsSchema.parse(req.query)

    const response = await fetchManyPosService({ limit, page, query })

    return res.status(200).json({
        data: response
    })
}