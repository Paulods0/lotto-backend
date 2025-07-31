import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/@common/query.schema';
import { fetchManyAgentsService } from '../../services/agent/fetch-many-agents.service';

export async function fetchManyAgentsController(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);
  const response = await fetchManyAgentsService(query);
  return res.status(200).json(response);
}
