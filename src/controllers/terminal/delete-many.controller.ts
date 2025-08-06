import z from 'zod';
import { BadRequestError } from '../../errors';
import type { Request, Response } from 'express';
import { deleteManyTerminal } from '../../services/terminal/delete-many.service';

export async function handle(req: Request, res: Response) {
  const idsSchema = z.object({
    ids: z.array(z.uuid()),
  });

  const { ids } = idsSchema.parse(req.body);

  if (ids.length === 0) {
    throw new BadRequestError('A lista de IDs não pode estar vazia.');
  }
  await deleteManyTerminal(ids);

  return res.status(200).json({
    message: 'Terminais removidos com sucesso.',
  });
}
