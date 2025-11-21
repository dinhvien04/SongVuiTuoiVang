# 🌟 Sống Vui Khỏe - Nền tảng kết nối người cao tuổi

Một nền tảng web hiện đại giúp người cao tuổi kết nối, tham gia các hoạt động giải trí và duy trì lối sống khỏe mạnh.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Tính năng chính

### 🔐 Xác thực & Bảo mật
- ✅ Đăng ký tài khoản với xác thực OTP qua Gmail
- ✅ Đăng nhập với email hoặc số điện thoại
- ✅ Quên mật khẩu với xác thực OTP
- ✅ JWT Authentication
- ✅ Password hashing với bcrypt
- ✅ OTP tự động hết hạn sau 10 phút

### 👤 Quản lý người dùng
- ✅ Hiển thị thông tin người dùng sau đăng nhập
- ✅ Avatar với chữ cái đầu tên
- ✅ Dropdown menu với thông tin chi tiết
- ✅ Đăng xuất an toàn

### 🎨 Giao diện
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS
- ✅ Hero banner với hình ảnh đẹp
- ✅ Các hoạt động nổi bật
- ✅ Testimonials từ thành viên
- ✅ Footer với thông tin liên hệ

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

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user | ✅ |

### OTP
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/otp/send-register` | Gửi OTP đăng ký | ❌ |
| POST | `/api/otp/send-reset` | Gửi OTP reset mật khẩu | ❌ |
| POST | `/api/otp/verify` | Xác thực OTP | ❌ |
| POST | `/api/otp/reset-password` | Đặt lại mật khẩu | ❌ |

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
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

## 📁 Cấu trúc thư mục

```
SongVuiTuoiVang/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Email utilities
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   └── package.json
├── fountend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
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

## 🐛 Troubleshooting

### Không nhận được email OTP
1. Kiểm tra spam/junk folder
2. Kiểm tra `EMAIL_PASSWORD` trong `.env` đúng chưa
3. Kiểm tra 2-Step Verification đã bật chưa
4. Xem log backend để kiểm tra lỗi gửi email

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
mongod --version
```

### Port đã được sử dụng
```bash
# Windows: Kill process trên port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
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
