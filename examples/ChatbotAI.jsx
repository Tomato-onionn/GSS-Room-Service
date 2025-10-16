// ChatbotAI.jsx - React Component Example
// Tích hợp Chatbot AI Gemini vào React App

import React, { useState, useEffect, useRef } from "react";
import "./ChatbotAI.css"; // Import CSS file

const API_BASE_URL = "http://localhost:3000/api/chat";

const ChatbotAI = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Chat state
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Translation state
  const [textToTranslate, setTextToTranslate] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [translationResult, setTranslationResult] = useState(null);

  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ============ TRANSLATION FUNCTIONS ============
  const handleTranslate = async () => {
    if (!textToTranslate.trim()) {
      setError("Vui lòng nhập văn bản cần dịch");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: sourceLang,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslationResult(data.data);
      } else {
        setError(data.message || "Dịch thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============ CHAT FUNCTIONS ============
  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Vui lòng nhập tin nhắn");
      return;
    }

    const userMessage = message;
    setMessage("");
    setLoading(true);
    setError("");

    // Add user message to chat
    setChatHistory((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response to chat
        setChatHistory((prev) => [
          ...prev,
          {
            type: "ai",
            content: data.data.aiResponse,
            timestamp: new Date(),
          },
        ]);

        // Update conversation history
        setConversationHistory((prev) => [
          ...prev,
          {
            userMessage: userMessage,
            aiResponse: data.data.aiResponse,
          },
        ]);
      } else {
        setError(data.message || "Chat thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối: " + err.message);
      // Remove user message if error
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc muốn xóa lịch sử chat?")) {
      setChatHistory([]);
      setConversationHistory([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === "chat") {
        handleSendMessage();
      } else {
        handleTranslate();
      }
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderTranslationTab = () => (
    <div className="tab-content">
      <div className="form-group">
        <label>📝 Văn bản cần dịch:</label>
        <textarea
          value={textToTranslate}
          onChange={(e) => setTextToTranslate(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập văn bản tiếng Anh hoặc tiếng Trung..."
          rows={5}
        />
      </div>

      <div className="form-group">
        <label>🌍 Ngôn ngữ nguồn:</label>
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
        >
          <option value="auto">Tự động phát hiện</option>
          <option value="en">Tiếng Anh</option>
          <option value="zh">Tiếng Trung</option>
          <option value="zh-CN">Tiếng Trung (Trung Quốc)</option>
          <option value="zh-TW">Tiếng Trung (Đài Loan)</option>
        </select>
      </div>

      <button
        className="btn-primary"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "⏳ Đang dịch..." : "🚀 Dịch Ngay"}
      </button>

      {translationResult && (
        <div className="result-box success">
          <h3>✅ Kết Quả Dịch</h3>
          <div className="result-item">
            <strong>Văn bản gốc:</strong>
            <p>{translationResult.originalText}</p>
          </div>
          <div className="result-item">
            <strong>Bản dịch:</strong>
            <p className="translated-text">
              {translationResult.translatedText}
            </p>
          </div>
          <div className="result-meta">
            {translationResult.sourceLang} → {translationResult.targetLang}
          </div>
        </div>
      )}
    </div>
  );

  const renderChatTab = () => (
    <div className="tab-content">
      <div className="chat-container">
        <div className="chat-messages">
          {chatHistory.length === 0 ? (
            <div className="empty-chat">
              <p>👋 Xin chào! Tôi có thể giúp gì cho bạn?</p>
              <p className="hint">
                💡 Bạn có thể chat bằng tiếng Việt, Anh hoặc Trung
              </p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString("vi-VN")}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
            rows={2}
            disabled={loading}
          />
          <div className="chat-actions">
            <button
              className="btn-secondary"
              onClick={handleClearChat}
              disabled={chatHistory.length === 0}
            >
              🗑️ Xóa
            </button>
            <button
              className="btn-primary"
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
            >
              {loading ? "⏳ Đang gửi..." : "📤 Gửi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chatbot-ai-container">
      <div className="chatbot-header">
        <h2>🤖 Chatbot AI với Gemini</h2>
        <p>Dịch thuật & Trò chuyện thông minh</p>
      </div>

      <div className="chatbot-tabs">
        <button
          className={`tab ${activeTab === "translate" ? "active" : ""}`}
          onClick={() => setActiveTab("translate")}
        >
          🌐 Dịch Văn Bản
        </button>
        <button
          className={`tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat AI
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="chatbot-content">
        {activeTab === "translate" ? renderTranslationTab() : renderChatTab()}
      </div>
    </div>
  );
};

export default ChatbotAI;
