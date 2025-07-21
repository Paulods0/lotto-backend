import type { Request, Response } from "express"
import { createAgentService } from "../../services/agent/create-agent.service"
import { createAgentSchema } from "../../validations/agent-schemas/create-agent-schema"

export async function createAgentController(req: Request, res: Response) {

    const body = createAgentSchema.parse(req.body)
    const response = await createAgentService(body)

    return res.status(201).json({
        message: "Agente criado com sucesso",
        data: response
    })
}