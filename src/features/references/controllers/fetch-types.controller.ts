import type { Request, Response } from 'express';
import { fetchManyTypes } from '../services/fetch-types-service';

export async function handle(_req: Request, res: Response) {
  const response = await fetchManyTypes();
  return res.status(200).json(response);
}
