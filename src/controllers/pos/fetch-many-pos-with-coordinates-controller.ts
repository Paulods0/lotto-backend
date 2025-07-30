import type { Request, Response } from 'express';
import { coordinatesSchema } from '../../validations/pos-schemas/coordinates';
import { fecthManyPosWithCoordinates } from '../../services/pos/fetch-many-pos-with-coordinates-service';

export async function fetchManyPosWithCoordinatesController(req: Request, res: Response) {
  const coordinates = coordinatesSchema.parse(req.query);
  const response = await fecthManyPosWithCoordinates(coordinates);
  return res.status(200).json(response);
}
