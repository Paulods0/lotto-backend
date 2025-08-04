import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { getLicenceController } from '../controllers/licence/get-licence-controller';
import { createLicenceController } from '../controllers/licence/create-licence-controller';
import { deleteLicenceController } from '../controllers/licence/delete-licence-controller';
import { fetchManyLicencesController } from '../controllers/licence/fetch-many-licences-controller';
import { updateLicenceController } from '../controllers/licence/update-licence-controller';

const licenceRouter = Router();

licenceRouter.post('/', catchErrors(createLicenceController));
licenceRouter.put('/:id', catchErrors(updateLicenceController));
licenceRouter.delete('/:id', catchErrors(deleteLicenceController));
licenceRouter.get('/:id', catchErrors(getLicenceController));
licenceRouter.get('/', catchErrors(fetchManyLicencesController));

export default licenceRouter;
