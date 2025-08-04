import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { createTerminalService } from '../../services/terminal/create-terminal.service';
import { createTerminalSchema } from '../../validations/terminal-schemas/create-terminal-schema';

export async function createTerminalController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const body = createTerminalSchema.parse({ ...req.body, user });
  const response = await createTerminalService(body);

  return res.status(201).json({
    message: 'Terminal criado com sucesso',
    data: response,
  });
}
