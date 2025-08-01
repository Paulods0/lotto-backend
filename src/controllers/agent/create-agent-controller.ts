import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { createAgentService } from '../../services/agent/create-agent.service';
import { createAgentSchema } from '../../validations/agent-schemas/create-agent-schema';

export async function createAgentController(req: Request, res: Response) {
  const user = req.user;
  
  const body = createAgentSchema.parse(req.body);

  const response = await createAgentService(body);

  return res.status(HttpStatus.CREATED).json({
    message: 'Agente criado com sucesso.',
    data: response,
  });
}
