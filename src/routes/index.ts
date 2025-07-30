import { Router } from 'express';
import posRouter from './pos-routes';
import userRouter from './user-routes';
import agentRouter from './agent-routes';
import loginRouter from './auth-router';
import licenceRouter from './licence-routes';
import terminalRouter from './terminal-routes';
import { authenticate } from '../middleware/auth/authenticate';
import { logoutController } from '../controllers/auth/logout-controller';
import { refreshTokenController } from '../controllers/auth/refresh-token';
import { adminRoutes, areasRoutes, provincesRoutes, typesRoutes } from './other-routes';

const router = Router();

// Auth routers
router.use('/auth/', loginRouter);
router.use('/auth/', logoutController);

// Main routers
router.use('/users', authenticate, userRouter);
router.use('/pos', authenticate, posRouter);
router.use('/agents', authenticate, agentRouter);
router.use('/licences', authenticate, licenceRouter);
router.use('/terminals', authenticate, terminalRouter);

// Other routers
router.use('/admins', authenticate, adminRoutes);
router.use('/types', authenticate, typesRoutes);
router.use('/areas', authenticate, areasRoutes);
router.use('/provinces', authenticate, provincesRoutes);

//refresh token
router.post('/refresh-token', refreshTokenController);

export default router;
