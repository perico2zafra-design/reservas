import { Router } from 'express';
import { getAllBlocks, createBlock } from '../controllers/block.controller.js';

const router = Router();

router.get('/', getAllBlocks);
router.post('/', createBlock);

export default router;
