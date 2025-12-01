import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
} from '../controllers/bookingController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/adminAuth';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/payment', protect, adminOnly, updatePaymentStatus);

export default router;
