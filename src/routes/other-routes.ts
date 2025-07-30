import { Router } from 'express';
import { fetchManyAdminsController } from '../controllers/references/fetch-many-admins-controller';
import { fetchManyAreasController } from '../controllers/references/fetch-many-areas-controller';
import { fetchManyProvincesController } from '../controllers/references/fetch-many-provinces-controller';
import { fetchManyTypesController } from '../controllers/references/fetch-many-types-controller';

const adminRoutes = Router();
const provincesRoutes = Router();
const typesRoutes = Router();
const areasRoutes = Router();

typesRoutes.get('/', fetchManyTypesController);
areasRoutes.get('/', fetchManyAreasController);
adminRoutes.get('/', fetchManyAdminsController);
provincesRoutes.get('/', fetchManyProvincesController);

export { typesRoutes, adminRoutes, areasRoutes, provincesRoutes };
