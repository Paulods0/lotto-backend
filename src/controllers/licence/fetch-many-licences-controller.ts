import type { Request, Response } from 'express';
import { paramsSchema } from '../../validations/@common/query.schema';
import { fetchManyLicencesService } from '../../services/licence/fetch-many-licences.service';

export async function fetchManyLicencesController(req: Request, res: Response) {
  const { limit, page, query } = paramsSchema.parse(req.query);
  const response = await fetchManyLicencesService({ limit, page, query });
  return res.status(200).json(response);
}
