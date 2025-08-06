import { Router } from 'express';

import catchErrors from '../utils/catch-errors';
import { handle as getLicenceController } from '../controllers/licence/get.controller';
import { handle as createLicenceController } from '../controllers/licence/create.controller';
import { handle as deleteLicenceController } from '../controllers/licence/delete.controller';
import { handle as updateLicenceController } from '../controllers/licence/update.controller';
import { handle as fetchManyLicencesController } from '../controllers/licence/fetch-many.controller';

const licenceRouter = Router();

licenceRouter.post('/', catchErrors(createLicenceController));
licenceRouter.put('/:id', catchErrors(updateLicenceController));
licenceRouter.delete('/:id', catchErrors(deleteLicenceController));
licenceRouter.get('/:id', catchErrors(getLicenceController));
licenceRouter.get('/', catchErrors(fetchManyLicencesController));

export default licenceRouter;
