import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { HttpStatus } from '../../../constants/http';
import { buildUserAbillity } from '../../../permissions/build-abillity';
import { updateAgentSchema } from '../../../validations/agent/update.schema';
import { idSchema } from '../../../validations/common/id.schema';
import { updateAgent } from '../services/update-agent.service';

export async function updateAgentController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const abillity = await buildUserAbillity(user.id);

  if (!abillity.can('update', 'Agents')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão.' });
  }

  const { id } = idSchema.parse(req.params);
  const body = updateAgentSchema.parse({ ...req.body, id, user });

  const response = await updateAgent(body);

  return res.status(200).json({
    message: 'Agente atualizado com sucesso.',
    data: response,
  });
}
