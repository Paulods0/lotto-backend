import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { idSchema } from '../../validations/common/id.schema';
import { updateAgent } from '../../services/agent/update.service';
import { updateAgentSchema } from '../../validations/agent/update.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);
  const body = updateAgentSchema.parse({ ...req.body, id, user });

  const response = await updateAgent(body);

  return res.status(200).json({
    message: 'Agente atualizado com sucesso.',
    data: response,
  });
}
