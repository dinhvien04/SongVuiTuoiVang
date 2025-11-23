import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import User from '../models/User';

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    const user = await User.findById(req.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền truy cập',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập',
    });
  }
};
