import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import otpRoutes from './routes/otpRoutes';
import activityRoutes from './routes/activityRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Song Vui Khoe API' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/activities', activityRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
