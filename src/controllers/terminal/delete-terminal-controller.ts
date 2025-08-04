import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { deleteTerminalService } from '../../services/terminal/delete-terminal.service';
import { AuthPayload } from '../../@types/auth-payload';

export async function deleteTerminalController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user as AuthPayload;

  await deleteTerminalService(id, user);

  return res.status(200).json({
    message: 'Terminal removido com sucesso',
  });
}
