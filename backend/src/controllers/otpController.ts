import { Request, Response } from 'express';
import OTP from '../models/OTP';
import User from '../models/User';
import { generateOTP, sendOTPEmail } from '../utils/email';

// @desc    Send OTP for registration
// @route   POST /api/otp/send-register
export const sendRegisterOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng',
      });
    }

    // Delete old OTPs for this email
    await OTP.deleteMany({ email, type: 'register' });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      type: 'register',
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, 'register');

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email. Vui lòng thử lại!',
      });
    }

    res.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, type } = req.body;

    if (!email || !otp || !type) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ hoặc đã hết hạn',
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: 'Xác thực OTP thành công',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Send OTP for password reset
// @route   POST /api/otp/send-reset
export const sendResetPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống',
      });
    }

    // Delete old OTPs for this email
    await OTP.deleteMany({ email, type: 'reset-password' });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      type: 'reset-password',
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, 'reset-password');

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Không thể gửi email. Vui lòng thử lại!',
      });
    }

    res.json({
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/otp/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'reset-password',
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Mã OTP không hợp lệ hoặc chưa được xác thực',
      });
    }

    // Update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};
