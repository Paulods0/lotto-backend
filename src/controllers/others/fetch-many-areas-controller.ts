import type { Request, Response } from "express"
import { fetchManyAreasService } from "../../services/others/fetch-many-areas-service"

export async function fetchManyAreasController(_req: Request, res: Response) {

    const response = await fetchManyAreasService()

    return res.status(200).json({ data:response })
}