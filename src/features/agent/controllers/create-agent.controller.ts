import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { createAgent } from '../services/create-agent.service';
import { createAgentSchema } from '../schemas/create-agent.schema';

export async function createAgentController(req: Request, res: Response) {
  const user = req.user as AuthPayload;
  const abillity = await buildUserAbillity(user.id);

  if (!abillity.can('write', 'Agents')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem persmissão.' });
  }

  const body = createAgentSchema.parse({ ...req.body, user });

  const response = await createAgent(body);

  return res.status(HttpStatus.CREATED).json({
    message: 'Agente criado com sucesso.',
    data: response,
  });
}
