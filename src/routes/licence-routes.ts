import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getLicenceController } from '../controllers/licence/get-licence-controller';
import { editLicenceController } from '../controllers/licence/edit-licence-controller';
import { createLicenceController } from '../controllers/licence/create-licence-controller';
import { deleteLicenceController } from '../controllers/licence/delete-licence-controller';
import { fetchManyLicencesController } from '../controllers/licence/fetch-many-licences-controller';

const licenceRouter = Router();

licenceRouter.post('/', catchErrors(createLicenceController));
licenceRouter.put('/:id', catchErrors(editLicenceController));
licenceRouter.delete('/:id', catchErrors(deleteLicenceController));
licenceRouter.get('/:id', catchErrors(getLicenceController));
licenceRouter.get('/', catchErrors(fetchManyLicencesController));

export default licenceRouter;
