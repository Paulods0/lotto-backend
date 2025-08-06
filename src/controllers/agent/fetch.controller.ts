import { Request, Response } from 'express';
import { paramsSchema } from '../../validations/common/query.schema';
import { fetchManyAgents } from '../../services/agent/fetch-many.service';

export async function handle(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);

  const response = await fetchManyAgents(query);

  return res.status(200).json(response);
}
