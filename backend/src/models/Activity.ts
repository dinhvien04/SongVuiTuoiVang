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
  package: 'vip' | 'standard';
  price: number;
  priceUnit: string;
  location?: string;
  instructor?: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên dịch vụ'],
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
      required: [true, 'Vui lòng nhập số người'],
    },
    category: {
      type: String,
      enum: ['games', 'class', 'music', 'sports', 'other'],
      required: [true, 'Vui lòng chọn loại'],
    },
    format: {
      type: String,
      enum: ['online', 'offline'],
      required: [true, 'Vui lòng chọn hình thức'],
    },
    package: {
      type: String,
      enum: ['vip', 'standard'],
      required: [true, 'Vui lòng chọn gói dịch vụ'],
      default: 'standard',
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
    },
    priceUnit: {
      type: String,
      default: 'VNĐ/tháng',
    },
    location: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
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
