import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { getLicenceService } from '../../services/licence/get-licence.service';

export async function getLicenceController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const response = await getLicenceService(id);
  return res.status(200).json(response);
}
