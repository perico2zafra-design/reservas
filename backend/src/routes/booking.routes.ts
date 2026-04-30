import { Router } from 'express';
import { 
  getAllBookings, 
  createBookingPaymentIntent, 
  confirmBooking, 
  manageDeposit,
  deleteBooking 
} from '../controllers/booking.controller.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, getAllBookings);
router.post('/payment-intent', authenticateToken, createBookingPaymentIntent);
router.post('/confirm', authenticateToken, confirmBooking);
router.patch('/:id/deposit', authenticateToken, authorizeAdmin, manageDeposit);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
