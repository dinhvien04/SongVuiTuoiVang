# 🚀 Deploy Ngay - Hướng Dẫn Nhanh

## ✅ Đã Chuẩn Bị

- MongoDB Atlas: `mongodb+srv://chaynhu121234_db_user:TmXKHINuPCYC8Tft@dcluster0.clthmid.mongodb.net/songvuikhoe?retryWrites=true&w=majority&appName=Cluster0`
- Code đã cập nhật CORS và API URL
- Environment files đã tạo

---

## 📝 Các Bước Deploy

### Bước 1: Push Code Lên GitHub

```bash
git add .
git commit -m "Ready for deployment - Add production configs"
git push origin main
```

**Nếu chưa có GitHub repo:**
1. Tạo repo mới tại: https://github.com/new
2. Tên repo: `SongVuiTuoiVang`
3. Chạy:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SongVuiTuoiVang.git
git push -u origin main
```

---

### Bước 2: Deploy Backend Lên Render

1. **Đăng ký Render**: https://render.com (dùng GitHub)

2. **Tạo Web Service**:
   - Click "New +" → "Web Service"
   - Connect repository: `SongVuiTuoiVang`
   - Click "Connect"

3. **Cấu hình**:
   ```
   Name: songvuikhoe-backend
   Region: Singapore
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables** (Click "Add Environment Variable"):
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://chaynhu121234_db_user:TmXKHINuPCYC8Tft@dcluster0.clthmid.mongodb.net/songvuikhoe?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=songvuikhoe_production_jwt_secret_2024_very_secure_key
   EMAIL_USER=vien.computer.2004@gmail.com
   EMAIL_PASSWORD=qlujwghpistyoepm
   EMAIL_FROM=vien.computer.2004@gmail.com
   MEGALLM_API_KEY=sk-mega-dbd1ef2906bf03ac1a2b22ff6c79bfdf0390be9cbdd0d49ecaf93780cc27216f
   MEGALLM_BASE_URL=https://ai.megallm.io/v1
   MEGALLM_MODEL=llama3.3-70b-instruct
   ```

5. **Deploy**: Click "Create Web Service"

6. **Đợi 5-10 phút**, copy URL: `https://songvuikhoe-backend.onrender.com`

7. **Test**: Mở `https://songvuikhoe-backend.onrender.com/api/health`

---

### Bước 3: Deploy Frontend Lên Vercel

1. **Đăng ký Vercel**: https://vercel.com/signup (dùng GitHub)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Chọn repository: `SongVuiTuoiVang`
   - Click "Import"

3. **Cấu hình**:
   ```
   Framework Preset: Create React App
   Root Directory: fountend (Click Edit → chọn fountend)
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://songvuikhoe-backend.onrender.com/api
   ```
   ⚠️ **Thay URL bằng URL backend thực tế từ Render!**

5. **Deploy**: Click "Deploy"

6. **Đợi 3-5 phút**, copy URL: `https://songvuikhoe.vercel.app`

---

### Bước 4: Cập Nhật CORS Backend

1. Lấy domain frontend từ Vercel (ví dụ: `https://songvuikhoe-abc123.vercel.app`)

2. Cập nhật `backend/src/server.ts`:
   ```typescript
   app.use(cors({
     origin: [
       'http://localhost:3001',
       'https://songvuikhoe-abc123.vercel.app'  // ← Domain thực tế
     ],
     credentials: true
   }));
   ```

3. Push code:
   ```bash
   git add .
   git commit -m "Update CORS for production domain"
   git push origin main
   ```

4. Render sẽ tự động deploy lại

---

### Bước 5: Seed Data (Tùy chọn)

Nếu muốn thêm 12 hoạt động mẫu:

1. Vào Render Dashboard → Service → "Shell" tab
2. Chạy: `npm run seed`
3. Hoặc dùng MongoDB Atlas → Collections → Import data

---

## ✅ Checklist

- [ ] Push code lên GitHub
- [ ] Deploy backend lên Render
- [ ] Copy backend URL
- [ ] Deploy frontend lên Vercel với backend URL
- [ ] Copy frontend URL
- [ ] Cập nhật CORS với frontend URL
- [ ] Test website
- [ ] Seed data (nếu cần)

---

## 🧪 Test Website

Sau khi deploy xong, test:

1. **Trang chủ**: Mở frontend URL
2. **API**: Mở `backend-url/api/health`
3. **Đăng ký**: Tạo tài khoản mới
4. **Đăng nhập**: Login với tài khoản vừa tạo
5. **Xem hoạt động**: Browse activities
6. **AI Chatbot**: Chat với AI
7. **Booking**: Thử đặt một hoạt động

---

## 🐛 Lỗi Thường Gặp

### "Cannot connect to backend"
- Kiểm tra `REACT_APP_API_URL` trong Vercel
- Kiểm tra CORS trong backend
- Xem logs trên Render

### "MongoDB connection failed"
- Kiểm tra `MONGODB_URI` trong Render
- Kiểm tra Network Access trong MongoDB Atlas (0.0.0.0/0)
- Restart service trên Render

### "AI Chatbot không hoạt động"
- Kiểm tra `MEGALLM_API_KEY` trong Render
- Xem logs backend

### Backend bị sleep (Free tier)
- Request đầu tiên sẽ chậm 30s
- Đây là hạn chế của free tier
- Upgrade lên $7/tháng để tránh sleep

---

## 💰 Chi Phí

- MongoDB Atlas: **$0** (512MB free)
- Render: **$0** (750h/tháng, có sleep)
- Vercel: **$0** (unlimited deployments)
- **Tổng: $0/tháng**

---

## 🎉 Hoàn Thành!

Website live tại:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

Chia sẻ link với bạn bè hoặc giáo viên! 🚀
