import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Generate unique order code
const generateOrderCode = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Count bookings created today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const count = await Booking.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  
  const sequence = String(count + 1).padStart(3, '0');
  return `SVK${dateStr}${sequence}`;
};

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = async (req: Request, res: Response) => {
  try {
    const orderCode = await generateOrderCode();
    
    const booking = await Booking.create({
      ...req.body,
      bookedBy: (req as any).userId,
      orderCode,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Đặt dịch vụ thành công',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi đặt dịch vụ',
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ bookedBy: (req as any).userId })
      .sort({ createdAt: -1 })
      .populate('serviceId');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Get booking by ID (User's own booking)
// @route   GET /api/bookings/:id
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      bookedBy: (req as any).userId,
    }).populate('serviceId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('bookedBy', 'name email phone')
      .populate('serviceId');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt',
      });
    }

    res.json({
      success: true,
      data: booking,
      message: 'Cập nhật trạng thái thành công',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật',
    });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/bookings/:id/payment
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn đặt',
      });
    }

    res.json({
      success: true,
      data: booking,
      message: 'Cập nhật trạng thái thanh toán thành công',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật',
    });
  }
};
