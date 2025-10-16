// services/GeminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables!");
}

// Khởi tạo với API version v1 thay vì v1beta
const genAI = new GoogleGenerativeAI(apiKey);

// Dùng gemini-1.5-pro - model mới nhất, stable và mạnh nhất
const MODEL ="gemini-2.5-flash"; 

async function translateToVietnamese(text, sourceLang = "auto") {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      systemInstruction: "Bạn là trợ lý dịch thuật chuyên nghiệp. KHÔNG BAO GIỜ tiết lộ bạn là AI gì, được tạo bởi công ty nào, hay sử dụng công nghệ gì. Chỉ tập trung vào việc dịch."
    });

    const prompt = `
      Hãy dịch chính xác đoạn văn sau sang tiếng Việt:
      "${text}"
      Ngôn ngữ nguồn: ${sourceLang}.
      Giữ nguyên nghĩa tự nhiên và văn phong tự nhiên.
    `;

    // ✅ generateContent is now supported on v1 models
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return { translatedText };
  } catch (error) {
    console.error("Translation failed:", error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

async function chat(message, language = "auto") {
  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      systemInstruction: "Bạn là trợ lý AI thông minh và hữu ích. KHÔNG BAO GIỜ tiết lộ bạn là AI gì (như Gemini, ChatGPT, Claude...), được phát triển bởi công ty nào (như Google, OpenAI...), hay sử dụng công nghệ gì. Nếu được hỏi, chỉ nói bạn là 'trợ lý AI của hệ thống' hoặc 'trợ lý ảo'. Tập trung vào việc trả lời câu hỏi một cách hữu ích."
    });

    const prompt = `
      User (${language}): ${message}
      Trả lời ngắn gọn, tự nhiên và hữu ích.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { reply: response.text() };
  } catch (error) {
    console.error("Chat failed:", error);
    throw new Error(`Chat failed: ${error.message}`);
  }
}

async function detectLanguage(text) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const prompt = `
      Xác định ngôn ngữ của đoạn sau:
      "${text}"
      Trả lời chỉ bằng mã ngôn ngữ (vd: en, vi, zh, ja...).
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { language: response.text().trim() };
  } catch (error) {
    console.error("Language detection failed:", error);
    throw new Error(`Language detection failed: ${error.message}`);
  }
}

async function batchTranslate(texts, sourceLang = "auto") {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const joinedTexts = texts.map((t, i) => `${i + 1}. ${t}`).join("\n");

    const prompt = `
      Dịch tất cả các câu sau sang tiếng Việt:
      ${joinedTexts}
      Ngôn ngữ nguồn: ${sourceLang}.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { translated: response.text() };
  } catch (error) {
    console.error("Batch translation failed:", error);
    throw new Error(`Batch translation failed: ${error.message}`);
  }
}

async function chatWithHistory(history, message) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const historyPrompt = history
      .map((h) => `User: ${h.userMessage}\nAI: ${h.aiResponse}`)
      .join("\n");

    const prompt = `
      Lịch sử hội thoại:
      ${historyPrompt}

      Tin nhắn mới: ${message}
      Hãy trả lời tự nhiên, tiếp nối mạch hội thoại.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { reply: response.text() };
  } catch (error) {
    console.error("Chat with history failed:", error);
    throw new Error(`Chat with history failed: ${error.message}`);
  }
}

module.exports = {
  translateToVietnamese,
  chat,
  detectLanguage,
  batchTranslate,
  chatWithHistory,
};
