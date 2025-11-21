import express from 'express';
import {
  sendRegisterOTP,
  verifyOTP,
  sendResetPasswordOTP,
  resetPassword,
} from '../controllers/otpController';

const router = express.Router();

router.post('/send-register', sendRegisterOTP);
router.post('/verify', verifyOTP);
router.post('/send-reset', sendResetPasswordOTP);
router.post('/reset-password', resetPassword);

export default router;
