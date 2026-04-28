import { Router } from 'express';
import { getAllBlocks, createBlock } from '../controllers/block.controller.js';
import { getBlockMembers, addBlockMember, removeBlockMember } from '../controllers/blockMember.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, getAllBlocks);
router.post('/', authenticateToken, createBlock);

// Membership routes
router.get('/:id/members', authenticateToken, getBlockMembers);
router.post('/:id/members', authenticateToken, addBlockMember);
router.delete('/members/:memberId', authenticateToken, removeBlockMember);

export default router;
