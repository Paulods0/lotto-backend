import type { Request, Response } from 'express';
import { AuthPayload } from '../../@types/auth-payload';
import { createTerminal } from '../../services/terminal/create.service';
import { createTerminalSchema } from '../../validations/terminal/create.schema';

export async function handle(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  const body = createTerminalSchema.parse({ ...req.body, user });
  const response = await createTerminal(body);

  return res.status(201).json({
    message: 'Terminal criado com sucesso',
    data: response,
  });
}
