import type { Request, Response } from 'express';
import { idSchema } from '../../validations/@common/id.schema';
import { updateLicenceService } from '../../services/licence/edit-licence.service';
import { editLicenceSchema } from '../../validations/licence-schemas/edit-licence-schema';

export async function editLicenceController(req: Request, res: Response) {
  const user = req.user;
  const { id } = idSchema.parse(req.params);
  const body = editLicenceSchema.parse({ ...req.body, id });

  const response = await updateLicenceService(body);

  return res.status(200).json({
    message: 'Os dados da Licença foram atualizados com sucesso.',
    data: response,
  });
}
