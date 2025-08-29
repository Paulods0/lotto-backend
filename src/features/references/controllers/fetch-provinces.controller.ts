import type { Request, Response } from 'express';
import { fetchManyProvinces } from '../services/fetch-provinces-service';

export async function handle(_req: Request, res: Response) {
  const response = await fetchManyProvinces();
  return res.status(200).json(response);
}
