import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { editTerminalService } from '../../services/terminal/edit-terminal.service';
import { editTerminalSchema } from '../../validations/terminal-schemas/edit-terminal-schema';

export async function editTerminalController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const user = req.user;

  console.log(user);
  console.log({ ...req.body, id, user });

  const body = editTerminalSchema.parse({ ...req.body, id, user });

  const response = await editTerminalService(body);

  return res.status(200).json({
    message: 'Os dados do terminal foram atualizados com sucesso.',
    data: response,
  });
}
