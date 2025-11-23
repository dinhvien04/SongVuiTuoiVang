import express from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/adminAuth';

const router = express.Router();

router.get('/', getActivities);
router.get('/:id', getActivity);
router.post('/', protect, adminOnly, createActivity);
router.put('/:id', protect, adminOnly, updateActivity);
router.delete('/:id', protect, adminOnly, deleteActivity);

export default router;
