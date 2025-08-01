import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { editAgentService } from '../../services/agent/edit-agent.service';
import { editAgentSchema } from '../../validations/agent-schemas/edit-agent-schema';

export async function editAgentController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user;
  const body = editAgentSchema.parse({ ...req.body, id, user });

  const response = await editAgentService(body);

  return res.status(200).json({
    message: 'Os dados do agente foram atualizados com sucesso.',
    data: response,
  });
}
