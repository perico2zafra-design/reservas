import { Router } from 'express';
import { 
  getAllRooms, 
  createRoom, 
  updateRoom, 
  deleteRoom,
  getRoomSchedules,
  addRoomSchedule,
  deleteRoomSchedule,
  getRoomExceptions,
  addRoomException,
  deleteRoomException
} from '../controllers/room.controller.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllRooms);
router.post('/', authenticateToken, authorizeAdmin, createRoom);
router.put('/:id', authenticateToken, authorizeAdmin, updateRoom);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteRoom);

// Schedules
router.get('/:id/schedules', getRoomSchedules);
router.post('/:id/schedules', authenticateToken, authorizeAdmin, addRoomSchedule);
router.delete('/schedules/:slotId', authenticateToken, authorizeAdmin, deleteRoomSchedule);

// Exceptions
router.get('/:id/exceptions', getRoomExceptions);
router.post('/:id/exceptions', authenticateToken, authorizeAdmin, addRoomException);
router.delete('/exceptions/:excId', authenticateToken, authorizeAdmin, deleteRoomException);

export default router;
