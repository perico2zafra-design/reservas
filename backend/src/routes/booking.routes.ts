import { Router } from 'express';
import { getAllBookings, createBooking, deleteBooking, getBookingHistory, getBookingStats } from '../controllers/booking.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, getAllBookings);
router.get('/history', authenticateToken, getBookingHistory);
router.get('/stats', authenticateToken, getBookingStats);
router.post('/', authenticateToken, createBooking);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
