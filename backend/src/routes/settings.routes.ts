import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authenticateToken, authorizeSuperAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, authorizeSuperAdmin, updateSettings);

export default router;
