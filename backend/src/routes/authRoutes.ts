import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/adminAuth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
