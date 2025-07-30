import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { getTerminalService } from '../../services/terminal/get-terminal.service';

export async function getTerminalController(req: Request, res: Response) {
  const { id } = idSchema.parse(req.params);
  const response = await getTerminalService(id);
  return res.status(200).json(response);
}
