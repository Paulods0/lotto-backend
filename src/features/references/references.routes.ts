import { Router } from 'express';

import { handle as fetchManyAreasController } from '../controllers/references/fetch-areas.controller';
import { handle as fetchManyTypesController } from '../controllers/references/fetch-types.controller';
import { handle as fetchManyAdminsController } from '../controllers/references/fetch-admins.controller';
import { handle as fetchManyProvincesController } from '../controllers/references/fetch-provinces.controller';

const adminRoutes = Router();
const provincesRoutes = Router();
const typesRoutes = Router();
const areasRoutes = Router();

typesRoutes.get('/', fetchManyTypesController);
areasRoutes.get('/', fetchManyAreasController);
adminRoutes.get('/', fetchManyAdminsController);
provincesRoutes.get('/', fetchManyProvincesController);

export { typesRoutes, adminRoutes, areasRoutes, provincesRoutes };
