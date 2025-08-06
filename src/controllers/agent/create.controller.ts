import type { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { AuthPayload } from '../../@types/auth-payload';
import { createAgent } from '../../services/agent/create.service';
import { createAgentSchema } from '../../validations/agent/create.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const body = createAgentSchema.parse({ ...req.body, user });

  const response = await createAgent(body);

  return res.status(HttpStatus.CREATED).json({
    message: 'Agente criado com sucesso.',
    data: response,
  });
}
