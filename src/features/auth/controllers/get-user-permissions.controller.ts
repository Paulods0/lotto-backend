import type { Response, Request } from 'express';
import { getUserPermissions } from '../../services/auth/get-user-permissions';
import { AuthPayload } from '../../@types/auth-payload';

export async function getUserPermissionsController(req: Request, res: Response) {
  const { id } = req.user as AuthPayload;
  const permissions = await getUserPermissions(id);

  res.status(200).json(permissions);
}
