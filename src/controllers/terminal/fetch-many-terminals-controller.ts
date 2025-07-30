import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/@common/query.schema';
import { fetchManyTerminalsService } from '../../services/terminal/fetch-many-terminals.service';

export async function fetchManyTerminalsController(req: Request, res: Response) {
  const { limit, page, query } = paramsSchema.parse(req.query);
  const response = await fetchManyTerminalsService({ limit, page, query });
  return res.status(200).json(response);
}
