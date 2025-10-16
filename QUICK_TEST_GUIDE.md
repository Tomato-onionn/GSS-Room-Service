# 🚀 Hướng Dẫn Test Nhanh Chatbot AI

## ✅ Server đã chạy thành công!

Server đang chạy tại: **http://localhost:3000**

## 🎯 3 Cách Test Ngay

### 1️⃣ Test bằng File HTML (Khuyến nghị - Dễ nhất)

1. Mở file `test-chatbot.html` bằng trình duyệt
2. Chọn tab bạn muốn test:
   - **🌐 Dịch Văn Bản**: Test dịch từ Anh/Trung sang Việt
   - **💬 Chat AI**: Chat đơn giản với AI
   - **💭 Hội Thoại**: Chat có lịch sử
3. Nhập nội dung và click nút để test!

**Ví dụ có sẵn:**

- Tab Dịch: "Hello, how are you today?"
- Tab Chat: "What is the weather like today?"

---

### 2️⃣ Test bằng PowerShell/CMD

Mở PowerShell mới và chạy:

#### Test 1: Dịch tiếng Anh sang tiếng Việt

```powershell
$body = @{
    text = "Hello, how are you today?"
    sourceLang = "en"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat/translate" -Method POST -Body $body -ContentType "application/json"
```

#### Test 2: Dịch tiếng Trung sang tiếng Việt

```powershell
$body = @{
    text = "你好，今天天气很好"
    sourceLang = "zh"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat/translate" -Method POST -Body $body -ContentType "application/json"
```

#### Test 3: Chat với AI

```powershell
$body = @{
    message = "What is the capital of Vietnam?"
    language = "en"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat/message" -Method POST -Body $body -ContentType "application/json"
```

#### Test 4: Phát hiện ngôn ngữ

```powershell
$body = @{
    text = "你好"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat/detect-language" -Method POST -Body $body -ContentType "application/json"
```

#### Test 5: Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/health" -Method GET
```

---

### 3️⃣ Test bằng Swagger UI (Chi tiết nhất)

1. Mở trình duyệt
2. Truy cập: http://localhost:3000/api-docs
3. Tìm section **"Chat & Translation"**
4. Click vào endpoint muốn test
5. Click **"Try it out"**
6. Nhập dữ liệu và click **"Execute"**

---

## 📋 Các API Endpoints Có Sẵn

| Endpoint                    | Method | Chức năng             |
| --------------------------- | ------ | --------------------- |
| `/api/chat/translate`       | POST   | Dịch văn bản          |
| `/api/chat/message`         | POST   | Chat với AI           |
| `/api/chat/detect-language` | POST   | Phát hiện ngôn ngữ    |
| `/api/chat/batch-translate` | POST   | Dịch nhiều văn bản    |
| `/api/chat/conversation`    | POST   | Chat có lịch sử       |
| `/api/chat/health`          | GET    | Kiểm tra sức khỏe API |

---

## 🧪 Ví Dụ Test Data

### Tiếng Anh → Tiếng Việt

```json
{
  "text": "Good morning! How can I help you today?",
  "sourceLang": "en"
}
```

### Tiếng Trung → Tiếng Việt

```json
{
  "text": "你好，我想学习越南语",
  "sourceLang": "zh"
}
```

### Chat đơn giản

```json
{
  "message": "Tell me about Vietnam",
  "language": "en"
}
```

### Chat với lịch sử

```json
{
  "message": "Bạn có thể nói thêm về điều đó không?",
  "history": [
    {
      "userMessage": "Việt Nam nằm ở đâu?",
      "aiResponse": "Việt Nam nằm ở Đông Nam Á..."
    }
  ]
}
```

### Batch Translation

```json
{
  "texts": ["Hello", "Good morning", "Thank you", "See you later"],
  "sourceLang": "en"
}
```

---

## ✨ Tính Năng Đặc Biệt

### 1. Tự động phát hiện ngôn ngữ

```json
{
  "text": "Hello 你好",
  "sourceLang": "auto"
}
```

### 2. Chat đa ngôn ngữ

AI có thể hiểu và trả lời cả tiếng Anh, Trung và Việt!

### 3. Context-aware conversation

Chatbot nhớ lịch sử hội thoại (tối đa 20 tin nhắn)

---

## 🎨 Giao Diện Test HTML

File `test-chatbot.html` có:

- ✅ 3 tabs chức năng
- ✅ Giao diện đẹp, responsive
- ✅ Loading animation
- ✅ Hiển thị kết quả rõ ràng
- ✅ Lưu lịch sử hội thoại
- ✅ Có thể thay đổi API URL

---

## 🔧 Troubleshooting

### Lỗi: Cannot connect to API

- ✅ Kiểm tra server có đang chạy không
- ✅ Kiểm tra port 3000 có bị chiếm không
- ✅ Thử restart server: `npm run dev`

### Lỗi: Translation failed

- ✅ Kiểm tra GEMINI_API_KEY trong .env
- ✅ Kiểm tra quota của API key
- ✅ Kiểm tra kết nối internet

### Lỗi: CORS

- ✅ Server đã cấu hình CORS cho localhost
- ✅ Nếu dùng domain khác, cần cập nhật CORS_ORIGIN

---

## 📊 Kết Quả Mong Đợi

### Dịch "Hello" → Kết quả

```json
{
  "success": true,
  "data": {
    "originalText": "Hello",
    "translatedText": "Xin chào",
    "sourceLang": "en",
    "targetLang": "vi"
  }
}
```

### Chat "你好" → Kết quả

AI sẽ phát hiện là tiếng Trung, dịch sang tiếng Việt và trả lời!

---

## 🎉 Chúc Mừng!

Backend chatbot AI của bạn đã sẵn sàng!

**Các bước tiếp theo:**

1. ✅ Test tất cả endpoints
2. ✅ Tích hợp vào frontend
3. ✅ Deploy lên production
4. ✅ Monitor API usage

**Tài liệu đầy đủ:** Xem file `CHATBOT_README.md`

**Cần hỗ trợ?**

- Swagger: http://localhost:3000/api-docs
- Health check: http://localhost:3000/api/chat/health

---

## 🚀 Quick Test Commands (Copy & Paste)

```powershell
# Test dịch
$body = '{"text":"Hello world","sourceLang":"en"}' | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/translate" -Method POST -Body $body -ContentType "application/json"

# Test chat
$body = '{"message":"Hi, how are you?","language":"en"}' | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/message" -Method POST -Body $body -ContentType "application/json"
```

**Enjoy! 🎊**
