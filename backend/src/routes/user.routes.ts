import { Router } from 'express';
import { getUsers, updateUserStatus, deleteUser, manualCreateUser } from '../controllers/user.controller.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, authorizeAdmin, getUsers);
router.post('/', authenticateToken, authorizeAdmin, manualCreateUser);
router.patch('/:id/status', authenticateToken, authorizeAdmin, updateUserStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

export default router;
