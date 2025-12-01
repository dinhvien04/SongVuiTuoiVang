import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  // Người đặt
  bookedBy: mongoose.Types.ObjectId;
  bookedByName: string;
  bookedByPhone: string;
  bookedByEmail: string;

  // Người sử dụng dịch vụ
  elderName: string;
  elderAge: number;
  elderGender: string;
  elderRelationship: string;
  elderHealth?: string;
  elderInsurance?: string;

  // Thông tin dịch vụ
  orderCode: string;
  serviceType: 'activity' | 'package';
  serviceId?: mongoose.Types.ObjectId;
  serviceName: string;
  packageType?: 'vip' | 'standard';
  startDate: Date;
  endDate: Date;
  notes?: string;

  // Thông tin thanh toán
  paymentMethod?: 'bank' | 'momo' | 'cash';
  totalAmount?: number;
  pricePerDay?: number;
  totalDays?: number;

  // Trạng thái
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookedByName: {
      type: String,
      required: true,
    },
    bookedByPhone: {
      type: String,
      required: true,
    },
    bookedByEmail: {
      type: String,
      required: true,
    },
    elderName: {
      type: String,
      required: true,
    },
    elderAge: {
      type: Number,
      required: true,
    },
    elderGender: {
      type: String,
      required: true,
    },
    elderRelationship: {
      type: String,
      required: true,
    },
    elderHealth: {
      type: String,
    },
    elderInsurance: {
      type: String,
    },
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      enum: ['activity', 'package'],
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
    },
    serviceName: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      enum: ['vip', 'standard'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['bank', 'momo', 'cash'],
    },
    totalAmount: {
      type: Number,
    },
    pricePerDay: {
      type: Number,
    },
    totalDays: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
