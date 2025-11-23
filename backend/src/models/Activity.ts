import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  participants: string;
  category: 'games' | 'class' | 'music' | 'sports' | 'other';
  format: 'online' | 'offline';
  location?: string;
  instructor?: string;
  price?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên hoạt động'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Vui lòng thêm hình ảnh'],
    },
    date: {
      type: String,
      required: [true, 'Vui lòng nhập ngày'],
    },
    time: {
      type: String,
      required: [true, 'Vui lòng nhập giờ'],
    },
    participants: {
      type: String,
      required: [true, 'Vui lòng nhập số người tham gia'],
    },
    category: {
      type: String,
      enum: ['games', 'class', 'music', 'sports', 'other'],
      required: [true, 'Vui lòng chọn loại hoạt động'],
    },
    format: {
      type: String,
      enum: ['online', 'offline'],
      required: [true, 'Vui lòng chọn hình thức'],
    },
    location: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IActivity>('Activity', activitySchema);
