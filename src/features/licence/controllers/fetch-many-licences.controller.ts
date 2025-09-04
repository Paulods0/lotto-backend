import type { Request, Response } from 'express';
import { AuthPayload } from '../../../@types/auth-payload';
import { paramsSchema } from '../../../schemas/common/query.schema';
import { fetchManyLicencesService } from '../services';
import { hasPermission } from '../../../middleware/auth/permissions';

export async function fetchManyLicencesController(req: Request, res: Response) {
  const user = req.user as AuthPayload;

  // await hasPermission({
  //   res,
  //   userId: user.id,
  //   permission: {
  //     action: 'READ',
  //     subject: 'Licences',
  //   },
  // });

  const query = paramsSchema.parse(req.query);
  const response = await fetchManyLicencesService(query);

  return res.status(200).json(response);
}
