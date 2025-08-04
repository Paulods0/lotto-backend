import type { Request, Response } from 'express';
import { fecthBoundedPosService } from '../../services/pos/fetch-bounded-pos-service';
import { boundedBoxSchema } from '../../validations/pos-schemas/bounds';

export async function fetchBoundedPosController(req: Request, res: Response) {
  const bounds = boundedBoxSchema.parse(req.query);
  const response = await fecthBoundedPosService(bounds);
  return res.status(200).json(response);
}
