# 🌟 Sống Vui Khỏe - Nền tảng Chăm sóc Người Cao Tuổi

Nền tảng web toàn diện kết nối người cao tuổi với các hoạt động sức khỏe, giải trí và dịch vụ chăm sóc chuyên nghiệp tại Quy Nhơn.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![AI](https://img.shields.io/badge/AI-MegaLLM-purple)

## ✨ Tính năng chính

### 🔐 Xác thực & Bảo mật
- ✅ Đăng ký tài khoản với xác thực OTP qua Gmail
- ✅ Đăng nhập với email hoặc số điện thoại
- ✅ Quên mật khẩu với xác thực OTP
- ✅ JWT Authentication
- ✅ Password hashing với bcrypt
- ✅ OTP tự động hết hạn sau 10 phút

### 👤 Quản lý Người dùng
- ✅ Profile cá nhân với avatar
- ✅ Chỉnh sửa thông tin cá nhân
- ✅ Lịch sử đặt chỗ và đơn hàng
- ✅ Quản lý giỏ hàng
- ✅ Theo dõi trạng thái booking

### 🎯 Hoạt động & Dịch vụ
- ✅ 12+ hoạt động đa dạng (Yoga, Thể dục, Cờ tướng, Ca hát, Du lịch...)
- ✅ Lọc theo danh mục: Trò chơi, Lớp học, Âm nhạc, Du lịch
- ✅ Lọc theo định dạng: Online/Offline
- ✅ Lọc theo gói: Standard/VIP
- ✅ Chi tiết hoạt động với hình ảnh, giá, lịch, địa điểm
- ✅ Đặt chỗ trực tuyến

### 💳 Thanh toán & Đơn hàng
- ✅ Giỏ hàng với quản lý số lượng
- ✅ Chỉnh sửa/xóa booking trong giỏ
- ✅ Tính tổng tiền tự động
- ✅ Thanh toán COD (Cash on Delivery)
- ✅ Xác nhận đơn hàng qua email
- ✅ Theo dõi trạng thái đơn hàng

### 📦 Gói Chăm sóc Toàn diện
- 💚 **Gói Thường** (250,000 VNĐ/ngày)
  - Chỗ ở 4-8 người
  - 3 bữa chính + 1-2 bữa phụ
  - Theo dõi sức khỏe cơ bản
  - Hoạt động tập thể
  
- 👑 **Gói VIP** (400,000 VNĐ/ngày)
  - Phòng đơn/đôi cao cấp
  - Thực đơn thiết kế riêng
  - Chăm sóc cá nhân 1:2-3
  - Bác sĩ theo dõi sát sao
  - Phục hồi chức năng

### 🤖 AI Chatbot Thông minh
- ✅ Trợ lý AI 24/7 powered by MegaLLM
- ✅ Tư vấn về hoạt động và gói dịch vụ
- ✅ Trả lời câu hỏi về giá, lịch, địa điểm
- ✅ So sánh gói Standard vs VIP
- ✅ Hỗ trợ đăng ký và thanh toán
- ✅ Giao diện thân thiện với người cao tuổi
- ✅ Hiển thị trên tất cả các trang

### 👨‍💼 Quản trị Admin
- ✅ Dashboard tổng quan
- ✅ Quản lý hoạt động (CRUD)
- ✅ Quản lý booking
- ✅ Quản lý người dùng
- ✅ Upload hình ảnh base64
- ✅ Thống kê doanh thu

### 🎨 Giao diện
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS với gradient đẹp mắt
- ✅ Hero banner động
- ✅ Testimonials từ thành viên
- ✅ Footer với thông tin liên hệ
- ✅ Hotline button floating
- ✅ AI Chatbot floating

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16
- MongoDB >= 5.0
- npm hoặc yarn

### 1️⃣ Clone repository
```bash
git clone https://github.com/dinhvien04/SongVuiTuoiVang.git
cd SongVuiTuoiVang
```

### 2️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cấu hình file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/songvuikhoe
JWT_SECRET=your_jwt_secret_key_change_this_in_production

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM=your-email@gmail.com

MEGALLM_API_KEY=sk-mega-your-api-key-here
MEGALLM_BASE_URL=https://ai.megallm.io/v1
MEGALLM_MODEL=llama3.3-70b-instruct
```

**Lưu ý:** `EMAIL_PASSWORD` phải là App Password của Gmail (16 ký tự), không phải mật khẩu Gmail thông thường.

Chạy backend:
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### 3️⃣ Cài đặt Frontend

```bash
cd fountend
npm install
```

Chạy frontend:
```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3001

### 4️⃣ Cài đặt MongoDB

**Windows:**
- Download từ: https://www.mongodb.com/try/download/community
- Hoặc dùng MongoDB Atlas (cloud)

**Kiểm tra MongoDB đang chạy:**
```bash
mongod --version
```

## 📧 Cấu hình Gmail để gửi OTP

1. Truy cập: https://myaccount.google.com/security
2. Bật "2-Step Verification" (Xác minh 2 bước)
3. Tìm "App passwords" (Mật khẩu ứng dụng)
4. Chọn "Mail" và "Other (Custom name)"
5. Đặt tên: "Song Vui Khoe"
6. Copy mật khẩu 16 ký tự và cập nhật vào `.env`

## 🤖 Cấu hình MegaLLM AI

1. Truy cập: https://megallm.io
2. Đăng ký tài khoản
3. Vào Dashboard > API Keys
4. Tạo API key mới
5. Copy API key và cập nhật vào `.env`

**Lưu ý:** API key có dạng `sk-mega-xxxxx...`

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user | ✅ |
| PUT | `/api/auth/update-profile` | Cập nhật profile | ✅ |

### OTP
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/otp/send-register` | Gửi OTP đăng ký | ❌ |
| POST | `/api/otp/send-reset` | Gửi OTP reset mật khẩu | ❌ |
| POST | `/api/otp/verify` | Xác thực OTP | ❌ |
| POST | `/api/otp/reset-password` | Đặt lại mật khẩu | ❌ |

### Activities
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/activities` | Lấy danh sách hoạt động | ❌ |
| GET | `/api/activities/:id` | Chi tiết hoạt động | ❌ |
| POST | `/api/activities` | Tạo hoạt động mới | ✅ Admin |
| PUT | `/api/activities/:id` | Cập nhật hoạt động | ✅ Admin |
| DELETE | `/api/activities/:id` | Xóa hoạt động | ✅ Admin |

### Bookings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | Lấy booking của user | ✅ |
| GET | `/api/bookings/all` | Lấy tất cả booking | ✅ Admin |
| POST | `/api/bookings` | Tạo booking mới | ✅ |
| PUT | `/api/bookings/:id` | Cập nhật booking | ✅ |
| DELETE | `/api/bookings/:id` | Xóa booking | ✅ |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Lấy đơn hàng của user | ✅ |
| GET | `/api/orders/:id` | Chi tiết đơn hàng | ✅ |
| POST | `/api/orders` | Tạo đơn hàng | ✅ |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái | ✅ Admin |

### AI Chatbot
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/chat` | Chat với AI | ❌ |
| POST | `/api/ai/chat/stream` | Chat streaming | ❌ |

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Context API** - State Management (Cart)
- **Fetch API** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **TypeScript** - Type Safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **Axios** - HTTP Client

### AI & External Services
- **MegaLLM** - AI Chatbot (Llama 3.3 70B)
- **Gmail SMTP** - Email OTP
- **Unsplash** - Images

## 📁 Cấu trúc thư mục

```
SongVuiTuoiVang/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── otpController.ts
│   │   │   ├── activityController.ts
│   │   │   ├── bookingController.ts
│   │   │   ├── orderController.ts
│   │   │   └── aiController.ts      # AI Chatbot
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── OTP.ts
│   │   │   ├── Activity.ts
│   │   │   ├── Booking.ts
│   │   │   └── Order.ts
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Seed data
│   │   ├── utils/          # Email utilities
│   │   └── server.ts       # Entry point
│   ├── seed-activities.json
│   ├── .env.example
│   └── package.json
├── fountend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AIChatBot.tsx    # AI Chatbot
│   │   │   └── HotlineButton.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── ActivitiesPage.tsx
│   │   │   ├── PackagesPage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   └── admin/      # Admin pages
│   │   ├── context/        # React Context
│   │   │   └── CartContext.tsx
│   │   ├── services/       # API services
│   │   │   ├── api.ts
│   │   │   └── megallm.ts  # AI service
│   │   ├── utils/          # Utilities
│   │   └── App.tsx         # Main app
│   └── package.json
└── README.md
```

## 🔒 Bảo mật

- ✅ Password được hash với bcrypt (10 rounds)
- ✅ JWT token có thời hạn 30 ngày
- ✅ OTP tự động hết hạn sau 10 phút
- ✅ OTP chỉ sử dụng được 1 lần
- ✅ CORS được cấu hình
- ✅ Validation dữ liệu đầu vào
- ✅ Environment variables cho thông tin nhạy cảm

## 🎯 Seed Data

Để thêm dữ liệu mẫu vào database:

```bash
cd backend
npm run seed
```

Sẽ tạo 12 hoạt động mẫu từ file `seed-activities.json`

## 🐛 Troubleshooting

### Không nhận được email OTP
1. Kiểm tra spam/junk folder
2. Kiểm tra `EMAIL_PASSWORD` trong `.env` đúng chưa
3. Kiểm tra 2-Step Verification đã bật chưa
4. Xem log backend để kiểm tra lỗi gửi email

### AI Chatbot không hoạt động
1. Kiểm tra `MEGALLM_API_KEY` trong `.env`
2. Kiểm tra backend đang chạy
3. Xem console browser để kiểm tra lỗi
4. Kiểm tra log backend: `MegaLLM Config`

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi động MongoDB (Windows)
net start MongoDB
```

### Port đã được sử dụng
```bash
# Windows: Kill process trên port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process trên port 3001 (frontend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Lỗi CORS
Đảm bảo backend có cấu hình CORS cho frontend:
```typescript
app.use(cors({
  origin: 'http://localhost:3001'
}));
```

## 👨‍💻 Tác giả

**Đinh Viên**
- GitHub: [@dinhvien04](https://github.com/dinhvien04)
- Email: vien.computer.2004@gmail.com

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🙏 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue nếu bạn có ý tưởng cải thiện dự án.

---

⭐ Nếu bạn thấy dự án hữu ích, hãy cho một star nhé!
