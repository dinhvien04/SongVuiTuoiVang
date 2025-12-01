# 🚀 Hướng Dẫn Deploy Sống Vui Khỏe

## 📋 Tổng Quan

Dự án sẽ được deploy lên 3 nơi:
- **Frontend (React)** → Vercel (Miễn phí)
- **Backend (Node.js)** → Render (Miễn phí)
- **Database (MongoDB)** → MongoDB Atlas (Miễn phí)

---

## Bước 1: Setup MongoDB Atlas ✅

### 1.1. Tạo Database User (Đang làm)

Bạn đang ở bước này rồi! Làm theo:

1. Copy **Username**: `dinhvien2i934_db_user`
2. Copy **Password**: `TmXKHINuPCYC8Tft` (Click "Copy")
3. Click "Create Database User"

### 1.2. Whitelist IP Address

1. Ở sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Nhập: `0.0.0.0/0`
5. Click "Confirm"

### 1.3. Lấy Connection String

1. Ở sidebar, click "Database"
2. Click "Connect" trên cluster của bạn
3. Chọn "Connect your application"
4. Copy connection string:
   ```
   mongodb+srv://dinhvien2i934_db_user:TmXKHINuPCYC8Tft@cluster0.xxxxx.mongodb.net/songvuikhoe?retryWrites=true&w=majority
   ```
5. Lưu lại connection string này!

---

## Bước 2: Chuẩn Bị Code

### 2.1. Cập nhật API URL trong Frontend

Tạo file `fountend/.env.production`:
```env
REACT_APP_API_URL=https://songvuikhoe-backend.onrender.com/api
```

### 2.2. Cập nhật CORS trong Backend

File `backend/src/server.ts` - thêm domain production:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://songvuikhoe.vercel.app',
    'https://songvuikhoe-frontend.vercel.app'
  ],
  credentials: true
}));
```

### 2.3. Kiểm tra .gitignore

Đảm bảo file `.env` KHÔNG bị commit:
```
# .gitignore
.env
.env.local
.env.production
node_modules/
dist/
build/
```

### 2.4. Push code lên GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Bước 3: Deploy Backend lên Render

### 3.1. Đăng ký Render

1. Truy cập: https://render.com
2. Click "Get Started for Free"
3. Đăng ký bằng GitHub

### 3.2. Tạo Web Service

1. Click "New +" → "Web Service"
2. Click "Connect account" để kết nối GitHub
3. Chọn repository: `SongVuiTuoiVang`
4. Click "Connect"

### 3.3. Cấu hình Service

**Basic Settings:**
- **Name**: `songvuikhoe-backend`
- **Region**: `Singapore` (gần VN nhất)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Instance Type:**
- Chọn: `Free` (0$/tháng)

### 3.4. Thêm Environment Variables

Scroll xuống "Environment Variables", click "Add Environment Variable":

```
PORT=5000
MONGODB_URI=mongodb+srv://dinhvien2i934_db_user:TmXKHINuPCYC8Tft@cluster0.xxxxx.mongodb.net/songvuikhoe?retryWrites=true&w=majority
JWT_SECRET=songvuikhoe_production_jwt_secret_2024_very_secure_key_change_this
EMAIL_USER=vien.computer.2004@gmail.com
EMAIL_PASSWORD=qlujwghpistyoepm
EMAIL_FROM=vien.computer.2004@gmail.com
MEGALLM_API_KEY=sk-mega-dbd1ef2906bf03ac1a2b22ff6c79bfdf0390be9cbdd0d49ecaf93780cc27216f
MEGALLM_BASE_URL=https://ai.megallm.io/v1
MEGALLM_MODEL=llama3.3-70b-instruct
```

**Lưu ý:** Thay `MONGODB_URI` bằng connection string thực tế từ MongoDB Atlas!

### 3.5. Deploy

1. Click "Create Web Service"
2. Đợi 5-10 phút để deploy
3. Khi thấy "Live", copy URL: `https://songvuikhoe-backend.onrender.com`

### 3.6. Test Backend

Mở browser, truy cập:
```
https://songvuikhoe-backend.onrender.com/api/health
```

Nếu thấy `{"status":"OK"}` → Backend đã chạy! ✅

### 3.7. Seed Data (Tùy chọn)

Nếu muốn thêm dữ liệu mẫu:

1. Ở Render Dashboard, click vào service
2. Click "Shell" tab
3. Chạy lệnh:
   ```bash
   npm run seed
   ```

---

## Bước 4: Deploy Frontend lên Vercel

### 4.1. Đăng ký Vercel

1. Truy cập: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel

### 4.2. Import Project

1. Click "Add New..." → "Project"
2. Tìm repository: `SongVuiTuoiVang`
3. Click "Import"

### 4.3. Cấu hình Project

**Configure Project:**
- **Framework Preset**: `Create React App`
- **Root Directory**: Click "Edit" → Chọn `fountend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4.4. Environment Variables

Click "Environment Variables", thêm:

```
REACT_APP_API_URL=https://songvuikhoe-backend.onrender.com/api
```

**Lưu ý:** Thay URL bằng URL backend thực tế từ Render!

### 4.5. Deploy

1. Click "Deploy"
2. Đợi 3-5 phút
3. Khi thấy "Congratulations", click "Visit"
4. Copy URL: `https://songvuikhoe.vercel.app`

---

## Bước 5: Cập nhật CORS Backend

### 5.1. Lấy Domain Frontend

Từ Vercel, copy domain: `https://songvuikhoe.vercel.app`

### 5.2. Cập nhật Code

File `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://songvuikhoe.vercel.app'  // ← Domain thực tế
  ],
  credentials: true
}));
```

### 5.3. Push Code

```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render sẽ tự động deploy lại sau vài phút.

---

## Bước 6: Kiểm Tra Website

### 6.1. Test Frontend

Truy cập: `https://songvuikhoe.vercel.app`

Kiểm tra:
- ✅ Trang chủ hiển thị
- ✅ Xem danh sách hoạt động
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ Chat với AI
- ✅ Đặt booking

### 6.2. Test Backend API

```bash
# Health check
curl https://songvuikhoe-backend.onrender.com/api/health

# Get activities
curl https://songvuikhoe-backend.onrender.com/api/activities
```

---

## 🎯 Hoàn Thành!

Website của bạn đã live tại:
- **Frontend**: https://songvuikhoe.vercel.app
- **Backend**: https://songvuikhoe-backend.onrender.com
- **Database**: MongoDB Atlas

---

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to backend"

**Nguyên nhân:** CORS chưa đúng

**Giải pháp:**
1. Kiểm tra domain frontend trong `backend/src/server.ts`
2. Push code lên GitHub
3. Đợi Render deploy lại

### Lỗi: "MongoDB connection failed"

**Nguyên nhân:** Connection string sai hoặc IP chưa whitelist

**Giải pháp:**
1. Kiểm tra MongoDB Atlas → Network Access → `0.0.0.0/0`
2. Kiểm tra connection string trong Render Environment Variables
3. Restart service trên Render

### Lỗi: "AI Chatbot không hoạt động"

**Nguyên nhân:** API key chưa đúng

**Giải pháp:**
1. Kiểm tra `MEGALLM_API_KEY` trong Render Environment Variables
2. Restart service

### Backend bị "sleep" (Free tier)

**Nguyên nhân:** Render free tier sleep sau 15 phút không dùng

**Giải pháp:**
- Request đầu tiên sẽ chậm (30s)
- Hoặc upgrade lên paid ($7/tháng)
- Hoặc dùng cron job ping mỗi 10 phút

---

## 📊 Chi Phí

| Service | Free Tier | Giới hạn |
|---------|-----------|----------|
| MongoDB Atlas | 512MB | Đủ cho demo |
| Render | 750h/tháng | Sleep sau 15 phút |
| Vercel | Unlimited | Băng thông 100GB/tháng |
| **Tổng** | **$0/tháng** | Đủ cho dự án học tập |

---

## 🚀 Nâng Cấp (Nếu cần)

### Mua Domain Riêng

1. Mua domain tại: Tên Miền Việt, GoDaddy, Namecheap
2. Cấu hình DNS trỏ về Vercel
3. Thêm domain vào Vercel Project Settings

### Upgrade Hosting

- **Render Pro**: $7/tháng (không sleep)
- **Vercel Pro**: $20/tháng (nhiều tính năng)
- **MongoDB Atlas M10**: $9/tháng (2GB RAM)

---

## 📝 Checklist Deploy

- [ ] MongoDB Atlas setup xong
- [ ] Backend deploy lên Render
- [ ] Frontend deploy lên Vercel
- [ ] CORS đã cấu hình đúng
- [ ] Environment variables đã thêm
- [ ] Test đăng ký/đăng nhập
- [ ] Test AI Chatbot
- [ ] Test booking
- [ ] Seed data vào database

---

## 🎉 Xong!

Website của bạn đã sẵn sàng để demo hoặc nộp bài!

Nếu gặp lỗi, check logs:
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments → View Function Logs
- **MongoDB**: Atlas → Metrics tab
