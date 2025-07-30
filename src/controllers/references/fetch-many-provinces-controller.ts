import type { Request, Response } from 'express';
import { fetchManyProvincesService } from '../../services/references/fetch-many-provinces-service';

export async function fetchManyProvincesController(_req: Request, res: Response) {
  const response = await fetchManyProvincesService();
  return res.status(200).json(response);
}
