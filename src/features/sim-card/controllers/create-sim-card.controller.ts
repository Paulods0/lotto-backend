import { Request, Response } from 'express';
import { HttpStatus } from '../../constants/http';
import { createSimCardService } from '../../services/sim-card/create-sim-card.service';
import { createSimCardSchema } from '../../validations/sim-card/create-sim-card.schema';

export async function createSimCardController(req: Request, res: Response) {
  const user = req.user;
  const body = createSimCardSchema.parse({ ...req.body, user });

  const response = await createSimCardService(body);

  return res.status(HttpStatus.CREATED).json({ id: response });
}
