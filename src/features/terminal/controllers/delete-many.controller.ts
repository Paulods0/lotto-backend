import z from 'zod';
import { BadRequestError } from '../../errors';
import type { Request, Response } from 'express';
import { deleteManyTerminal } from '../../services/terminal/delete-many.service';
import { AuthPayload } from '../../@types/auth-payload';
import { HttpStatus } from '../../constants/http';
import { buildUserAbillity } from '../../permissions/build-abillity';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const ability = await buildUserAbillity(user.id);

  if (!ability.can('delete', 'Terminals')) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Você não tem permissão' });
  }

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
