import type { Request, Response } from 'express';
import { getFeaturesService } from '../services/get-features.services';

export async function getFeaturesController(req: Request, res: Response) {
  const response = await getFeaturesService();
  return res.status(200).json(response);
}
