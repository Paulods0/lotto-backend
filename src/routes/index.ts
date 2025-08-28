import { Router } from 'express';
import posRouter from './pos.routes';
import authRouter from './auth.router';
import userRouter from './user.routes';
import agentRouter from './agent.routes';
import licenceRouter from './licence.routes';
import terminalRouter from './terminal.routes';
import auditLogRouter from './audit-log.routes';
import { authenticate } from '../middleware/auth/authenticate';
import { adminRoutes, areasRoutes, provincesRoutes, typesRoutes } from './references.routes';
import { handle as refreshTokenController } from '../controllers/auth/refresh-token.controller';
import groupRouter from './group.routes';
import simCardRouter from './sim-card.routes';

const router = Router();

// Auth routers
router.use('/auth', authRouter);

//refresh token
router.post('/refresh-token', refreshTokenController);

// Main routers
router.use('/users', authenticate, userRouter);
router.use('/sim-cards', authenticate, simCardRouter);
router.use('/pos', authenticate, posRouter);
router.use('/agents', authenticate, agentRouter);
router.use('/licences', authenticate, licenceRouter);
router.use('/terminals', authenticate, terminalRouter);
router.use('/groups', groupRouter);

// Other routers
router.use('/admins', authenticate, adminRoutes);
router.use('/types', authenticate, typesRoutes);
router.use('/areas', authenticate, areasRoutes);
router.use('/provinces', authenticate, provincesRoutes);

router.use('/audit-logs', authenticate, auditLogRouter);

export default router;
