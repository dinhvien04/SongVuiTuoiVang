import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  serviceName: string;
  serviceType: 'activity' | 'package';
  packageType?: 'vip' | 'standard';
  elderName: string;
  elderAge: number;
  elderGender: string;
  elderRelationship: string;
  elderHealth?: string;
  elderInsurance?: string;
  startDate: Date;
  endDate: Date;
  pricePerDay: number;
  totalDays: number;
  itemTotal: number;
  notes?: string;
}

export interface IOrder extends Document {
  // Thông tin đơn hàng
  orderCode: string;
  
  // Người đặt
  bookedBy: mongoose.Types.ObjectId;
  bookedByName: string;
  bookedByPhone: string;
  bookedByEmail: string;

  // Danh sách dịch vụ
  items: IOrderItem[];

  // Thông tin thanh toán
  paymentMethod?: 'bank' | 'momo' | 'cash';
  totalAmount: number;

  // Trạng thái
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  serviceName: { type: String, required: true },
  serviceType: { type: String, enum: ['activity', 'package'], required: true },
  packageType: { type: String, enum: ['vip', 'standard'] },
  elderName: { type: String, required: true },
  elderAge: { type: Number, required: true },
  elderGender: { type: String, required: true },
  elderRelationship: { type: String, required: true },
  elderHealth: { type: String },
  elderInsurance: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pricePerDay: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  itemTotal: { type: Number, required: true },
  notes: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, required: true, unique: true },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookedByName: { type: String, required: true },
    bookedByPhone: { type: String, required: true },
    bookedByEmail: { type: String, required: true },
    items: [orderItemSchema],
    paymentMethod: { type: String, enum: ['bank', 'momo', 'cash'] },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);