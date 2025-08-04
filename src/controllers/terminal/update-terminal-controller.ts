import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { updateTerminalService } from '../../services/terminal/update-terminal.service';
import { updateTerminalSchema } from '../../validations/terminal-schemas/update-terminal-schema';
import { AuthPayload } from '../../@types/auth-payload';

export async function updateTerminalController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const { id } = idSchema.parse(req.params);
  const body = updateTerminalSchema.parse({ ...req.body, id, user });

  const response = await updateTerminalService(body);

  return res.status(200).json({
    message: 'Os dados do terminal foram atualizados com sucesso.',
    data: response,
  });
}
