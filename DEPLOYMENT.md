# 🚀 Hướng dẫn Deploy

## Vấn đề đã sửa

✅ **Chatbot không hoạt động sau khi deploy** - Đã sửa hardcode `localhost:8080` trong `Chatbot.js`

## Cấu hình biến môi trường trên Vercel

### Frontend (Vercel)

1. Vào **Project Settings** → **Environment Variables**
2. Thêm biến môi trường sau:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Lưu ý:** 
- Thay `https://your-backend-url.com/api` bằng URL backend thực tế của bạn (ví dụ: Render, Railway, Heroku...)
- URL phải có `/api` ở cuối
- Sau khi thêm, cần **redeploy** để áp dụng thay đổi

### Backend (Render/Railway/Heroku...)

Thêm các biến môi trường sau:

```
# Database
DATABASE_URL=your-postgres-connection-string
# hoặc
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...

# JWT
JWT_SECRET=your-secret-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# News API
NEWSAPI_KEY=your-newsapi-key

# CORS - QUAN TRỌNG!
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

**Lưu ý về CORS:**
- Thay `https://your-frontend-domain.vercel.app` bằng domain Vercel thực tế của bạn
- Có thể thêm nhiều origins phân cách bởi dấu phẩy
- Phải bao gồm cả `http://localhost:3000` để test local vẫn hoạt động

## Kiểm tra sau khi deploy

1. ✅ Kiểm tra biến môi trường đã được set đúng chưa
2. ✅ Kiểm tra backend có chạy và accessible không (thử mở URL backend trong browser)
3. ✅ Kiểm tra CORS: Mở DevTools → Network → Xem request có bị chặn bởi CORS không
4. ✅ Kiểm tra console log trong browser xem có lỗi gì không

## Troubleshooting

### Chatbot vẫn không hoạt động?

1. **Kiểm tra Network tab trong DevTools:**
   - Xem request có được gửi đi không
   - Xem response status code là gì (200, 401, 403, 404, 500...)
   - Xem response body có thông báo lỗi gì không

2. **Kiểm tra CORS:**
   - Nếu thấy lỗi "CORS policy" → Kiểm tra `CORS_ALLOWED_ORIGINS` trong backend
   - Đảm bảo domain frontend đúng (bao gồm cả `https://`)

3. **Kiểm tra API URL:**
   - Mở DevTools → Console
   - Gõ: `process.env.REACT_APP_API_URL` (sau khi build, có thể không thấy)
   - Hoặc kiểm tra Network tab xem request đang gửi đến URL nào

4. **Kiểm tra Authentication:**
   - Đảm bảo đã đăng nhập (có token trong localStorage)
   - Endpoint `/api/ai/chat` có thể yêu cầu authentication

5. **Kiểm tra Backend logs:**
   - Xem logs của backend xem có nhận được request không
   - Xem có lỗi gì trong backend không

## Ví dụ cấu hình đầy đủ

### Vercel (Frontend)
```
REACT_APP_API_URL=https://health-manager-backend.onrender.com/api
```

### Render (Backend)
```
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-super-secret-key-here
GEMINI_API_KEY=AIzaSy...
NEWSAPI_KEY=abc123...
CORS_ALLOWED_ORIGINS=https://health-manager.vercel.app,http://localhost:3000
```

---

**Sau khi cấu hình xong, nhớ redeploy cả frontend và backend!**
