import type { Request, Response } from "express"
import { fetchManyTypesService } from "../../services/others/fetch-many-types-service"

export async function fetchManyTypesController(_req: Request, res: Response) {

    const response = await fetchManyTypesService()

    return res.status(200).json({ data:response })
}