# 📦 React Component Examples

Thư mục này chứa các ví dụ React component để tích hợp Chatbot AI vào frontend React của bạn.

## 📁 Files

- `ChatbotAI.jsx` - React component chính
- `ChatbotAI.css` - Styles cho component

## 🚀 Cách Sử Dụng

### 1. Copy files vào project React của bạn

```bash
# Copy vào thư mục components
src/
├── components/
│   ├── ChatbotAI.jsx
│   └── ChatbotAI.css
```

### 2. Import và sử dụng trong App

```jsx
// App.jsx
import React from "react";
import ChatbotAI from "./components/ChatbotAI";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ChatbotAI />
    </div>
  );
}

export default App;
```

### 3. Cấu hình API URL

Mở file `ChatbotAI.jsx` và thay đổi `API_BASE_URL`:

```javascript
// Development
const API_BASE_URL = "http://localhost:3000/api/chat";

// Production
const API_BASE_URL = "https://your-backend-url.com/api/chat";
```

## ✨ Tính Năng

Component này bao gồm:

- ✅ **Tab Dịch Văn Bản**: Dịch từ Anh/Trung sang Việt
- ✅ **Tab Chat AI**: Chat thông minh với context
- ✅ **Responsive Design**: Tương thích mobile
- ✅ **Real-time Chat**: Hiển thị tin nhắn ngay lập tức
- ✅ **Loading States**: Animation khi đang xử lý
- ✅ **Error Handling**: Xử lý lỗi thân thiện
- ✅ **Chat History**: Lưu lịch sử hội thoại
- ✅ **Auto Scroll**: Tự động cuộn xuống tin nhắn mới
- ✅ **Keyboard Shortcuts**: Enter để gửi, Shift+Enter xuống dòng

## 🎨 Customization

### Thay đổi màu sắc

Mở `ChatbotAI.css` và tùy chỉnh:

```css
/* Màu chủ đạo */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Thay bằng màu của bạn */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Thay đổi kích thước

```css
.chatbot-ai-container {
  max-width: 900px; /* Thay đổi chiều rộng */
}

.chat-container {
  height: 600px; /* Thay đổi chiều cao chat */
}
```

## 🔧 API Methods

Component sử dụng các API endpoints sau:

### 1. Dịch văn bản

```javascript
POST / api / chat / translate;
Body: {
  text, sourceLang;
}
```

### 2. Chat với context

```javascript
POST / api / chat / conversation;
Body: {
  message, history;
}
```

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Mobile: <= 768px

## 🎯 Props (Optional Enhancement)

Bạn có thể mở rộng component với props:

```jsx
<ChatbotAI
  apiUrl="https://your-api.com"
  theme="dark"
  placeholder="Nhập tin nhắn..."
  maxHistoryLength={20}
/>
```

## 🧪 Testing

Test component với:

```bash
npm test
```

## 📦 Dependencies

Component sử dụng:

- React (hooks: useState, useEffect, useRef)
- Native Fetch API (no axios required)

## 🎨 Styling Options

Component có thể styled với:

- CSS Modules
- Styled Components
- Tailwind CSS
- Material-UI

## 🌟 Advanced Features

### Add typing indicator

```jsx
const [isTyping, setIsTyping] = useState(false);

// Before AI response
setIsTyping(true);

// After AI response
setIsTyping(false);
```

### Add voice input

```jsx
// Use Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  setMessage(event.results[0][0].transcript);
};
```

### Add file upload

```jsx
const handleFileUpload = async (file) => {
  // Read file content
  // Send to API for translation
};
```

## 💡 Tips

1. **CORS**: Đảm bảo backend đã cấu hình CORS cho domain frontend
2. **Loading**: Hiển thị loading state để UX tốt hơn
3. **Error**: Handle tất cả error cases
4. **Accessibility**: Thêm ARIA labels cho screen readers
5. **Performance**: Debounce typing nếu có auto-translate

## 🐛 Troubleshooting

### Lỗi CORS

```javascript
// Backend: app.js
app.use(
  cors({
    origin: "http://your-frontend-domain.com",
    credentials: true,
  })
);
```

### Lỗi Network

```javascript
// Add retry logic
const fetchWithRetry = async (url, options, retries = 3) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

## 🤝 Contributing

Feel free to customize and enhance these components for your needs!

## 📄 License

Free to use in your projects.

---

**Happy Coding! 🚀**
