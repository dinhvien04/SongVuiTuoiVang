import { Request, Response } from 'express';
import Order from '../models/Order';

// Generate unique order code
const generateOrderCode = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Count orders created today
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const count = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  
  const sequence = String(count + 1).padStart(3, '0');
  return `SVK${dateStr}${sequence}`;
};

// @desc    Create order
// @route   POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log('=== CREATE ORDER REQUEST ===');
    console.log('User ID:', (req as any).userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { items, paymentMethod, totalAmount } = req.body;
    const orderCode = await generateOrderCode();
    
    console.log('Generated order code:', orderCode);
    
    const order = await Order.create({
      orderCode,
      bookedBy: (req as any).userId,
      bookedByName: req.body.bookedByName,
      bookedByPhone: req.body.bookedByPhone,
      bookedByEmail: req.body.bookedByEmail,
      items,
      paymentMethod,
      totalAmount,
    });

    console.log('Order created successfully:', order._id);
    console.log('===========================');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Đặt hàng thành công',
    });
  } catch (error: any) {
    console.error('=== CREATE ORDER ERROR ===');
    console.error('Error:', error);
    console.error('==========================');
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi đặt hàng',
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ bookedBy: (req as any).userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Get order by ID (User's own order)
// @route   GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      bookedBy: (req as any).userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('bookedBy', 'name email phone');

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.json({
      success: true,
      data: order,
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
// @route   PUT /api/orders/:id/payment
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng',
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Cập nhật trạng thái thanh toán thành công',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật',
    });
  }
};