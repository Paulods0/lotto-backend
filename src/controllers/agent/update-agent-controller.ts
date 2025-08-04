import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { updateAgentService } from '../../services/agent/update-agent.service';
import { updateAgentSchema } from '../../validations/agent-schemas/update-agent-schema';

export async function updateAgentController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const body = updateAgentSchema.parse({ ...req.body, id });

  const response = await updateAgentService(body);

  return res.status(200).json({
    message: 'Agente atualizado com sucesso.',
    data: response,
  });
}
