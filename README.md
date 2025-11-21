# Sống Vui Khỏe - Nền tảng kết nối người cao tuổi

## Cài đặt và Chạy dự án

### Backend

1. Cài đặt MongoDB trên máy của bạn hoặc sử dụng MongoDB Atlas
2. Vào thư mục backend:
```bash
cd backend
npm install
```

3. Cấu hình file `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/songvuikhoe
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

4. Chạy backend:
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### Frontend

1. Vào thư mục frontend:
```bash
cd fountend
npm install
```

2. Chạy frontend:
```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Tính năng

- ✅ Trang chủ với Hero banner, Activities, About, Testimonials
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với email/số điện thoại
- ✅ Backend API với MongoDB
- ✅ JWT Authentication
- ✅ Password hashing với bcrypt

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user (cần token)

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT
- Bcrypt
