import z from 'zod';
import type { Request, Response } from 'express';
import { deleteManyTerminalService } from '../../services/terminal/delete-many-terminals.service';
import { BadRequestError } from '../../errors';

export async function deleteManyTerminalsController(req: Request, res: Response) {
  const idsSchema = z.object({
    ids: z.array(z.uuid()),
  });

  console.log(req.body);

  const { ids } = idsSchema.parse(req.body);

  if (ids.length === 0) {
    throw new BadRequestError('A lista de IDs não pode estar vazia.');
  }
  await deleteManyTerminalService(ids);

  return res.status(200).json({
    message: 'Terminais removidos com sucesso.',
  });
}
