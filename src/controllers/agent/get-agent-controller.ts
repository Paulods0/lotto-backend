import type { Request, Response } from "express"
import { idSchema } from "../../validations/@common/id.schema"
import { getAgentService } from "../../services/agent/get-agent.service"

export async function getAgentController(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params)

    const response = await getAgentService(id)

    return res.status(200).json({
        data: response
    })
}