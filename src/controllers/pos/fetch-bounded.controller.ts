import type { Request, Response } from 'express';
import { fecthBoundedPos } from '../../services/pos/fetch-bounded-pos-service';
import { boundedBoxSchema } from '../../validations/pos/bounds';

export async function handle(req: Request, res: Response) {
  const bounds = boundedBoxSchema.parse(req.query);
  const response = await fecthBoundedPos(bounds);
  return res.status(200).json(response);
}
