import type { Request, Response } from 'express';
import { fetchManyAreas } from '../services/fetch-areas-service';

export async function handle(_req: Request, res: Response) {
  const response = await fetchManyAreas();
  return res.status(200).json(response);
}
