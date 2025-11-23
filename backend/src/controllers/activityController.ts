import { Request, Response } from 'express';
import Activity from '../models/Activity';

// @desc    Get all activities
// @route   GET /api/activities
export const getActivities = async (req: Request, res: Response) => {
  try {
    const { category, format, search } = req.query;

    let query: any = { isActive: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by format
    if (format) {
      query.format = format;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const activities = await Activity.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
export const getActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hoạt động',
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server',
    });
  }
};

// @desc    Create activity
// @route   POST /api/activities
export const createActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi tạo hoạt động',
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hoạt động',
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật hoạt động',
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hoạt động',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa hoạt động',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi xóa hoạt động',
    });
  }
};
