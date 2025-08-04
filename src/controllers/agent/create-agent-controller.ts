import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { createAgentService } from '../../services/agent/create-agent.service';
import { createAgentSchema } from '../../validations/agent-schemas/create-agent-schema';
import { AuthPayload } from '../../@types/auth-payload';

export async function createAgentController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const body = createAgentSchema.parse({ ...req.body, user });

  const response = await createAgentService(body);

  return res.status(HttpStatus.CREATED).json({
    message: 'Agente criado com sucesso.',
    data: response,
  });
}
