import { Router } from 'express'

import { fetchManyAreasController } from '../controllers/others/fetch-many-areas-controller'
import { fetchManyTypesController } from '../controllers/others/fetch-many-types-controller'
import { fetchManyAdminsController } from '../controllers/others/fetch-many-admins-controller'
import { fetchManyProvincesController } from '../controllers/others/fetch-many-provinces-controller'

const adminRoutes = Router()
const provincesRoutes = Router()
const typesRoutes = Router()
const areasRoutes = Router()

typesRoutes.get('/', fetchManyTypesController)
areasRoutes.get('/', fetchManyAreasController)
adminRoutes.get('/', fetchManyAdminsController)
provincesRoutes.get('/', fetchManyProvincesController)

export  { typesRoutes, adminRoutes, areasRoutes, provincesRoutes }