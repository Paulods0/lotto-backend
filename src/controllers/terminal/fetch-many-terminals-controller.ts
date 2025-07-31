import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/@common/query.schema';
import { fetchManyTerminalsService } from '../../services/terminal/fetch-many-terminals.service';

export async function fetchManyTerminalsController(req: Request, res: Response) {
  const query = paramsSchema.parse(req.query);
  const response = await fetchManyTerminalsService(query);
  return res.status(200).json(response);
}
