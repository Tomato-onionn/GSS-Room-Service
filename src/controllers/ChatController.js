const geminiService = require('../services/GeminiService');

class ChatController {
  /**
   * @swagger
   * /api/chat/translate:
   *   post:
   *     summary: Dịch văn bản từ tiếng Anh hoặc tiếng Trung sang tiếng Việt
   *     tags: [Chat & Translation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - text
   *             properties:
   *               text:
   *                 type: string
   *                 description: Văn bản cần dịch
   *                 example: "Hello, how are you?"
   *               sourceLang:
   *                 type: string
   *                 enum: [auto, en, zh, zh-CN, zh-TW]
   *                 default: auto
   *                 description: Ngôn ngữ nguồn (auto để tự động phát hiện)
   *     responses:
   *       200:
   *         description: Dịch thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       500:
   *         description: Lỗi server
   */
  async translate(req, res, next) {
    try {
      const { text, sourceLang = 'auto' } = req.body;

      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Text is required and must be a non-empty string',
        });
      }

      const result = await geminiService.translateToVietnamese(text, sourceLang);

      return res.status(200).json({
        success: true,
        message: 'Translation successful',
        data: result,
      });
    } catch (error) {
      console.error('Translation error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/chat/message:
   *   post:
   *     summary: Chat với AI Gemini (hỗ trợ dịch thuật)
   *     tags: [Chat & Translation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *             properties:
   *               message:
   *                 type: string
   *                 description: Tin nhắn gửi đến AI
   *                 example: "Xin chào, bạn có thể giúp tôi dịch không?"
   *               language:
   *                 type: string
   *                 enum: [auto, en, zh, vi]
   *                 default: auto
   *                 description: Ngôn ngữ của tin nhắn
   *     responses:
   *       200:
   *         description: Chat thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       500:
   *         description: Lỗi server
   */
  async chat(req, res, next) {
    try {
      const { message, language = 'auto' } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Message is required and must be a non-empty string',
        });
      }

      const result = await geminiService.chat(message, language);

      return res.status(200).json({
        success: true,
        message: 'Chat successful',
        data: result,
      });
    } catch (error) {
      console.error('Chat error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/chat/detect-language:
   *   post:
   *     summary: Phát hiện ngôn ngữ của văn bản
   *     tags: [Chat & Translation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - text
   *             properties:
   *               text:
   *                 type: string
   *                 description: Văn bản cần phát hiện ngôn ngữ
   *                 example: "你好"
   *     responses:
   *       200:
   *         description: Phát hiện thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       500:
   *         description: Lỗi server
   */
  async detectLanguage(req, res, next) {
    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Text is required and must be a non-empty string',
        });
      }

      const result = await geminiService.detectLanguage(text);

      return res.status(200).json({
        success: true,
        message: 'Language detection successful',
        data: result,
      });
    } catch (error) {
      console.error('Language detection error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/chat/batch-translate:
   *   post:
   *     summary: Dịch nhiều văn bản cùng lúc
   *     tags: [Chat & Translation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - texts
   *             properties:
   *               texts:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Mảng các văn bản cần dịch
   *                 example: ["Hello", "Good morning", "Thank you"]
   *               sourceLang:
   *                 type: string
   *                 enum: [auto, en, zh, zh-CN, zh-TW]
   *                 default: auto
   *                 description: Ngôn ngữ nguồn
   *     responses:
   *       200:
   *         description: Dịch thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       500:
   *         description: Lỗi server
   */
  async batchTranslate(req, res, next) {
    try {
      const { texts, sourceLang = 'auto' } = req.body;

      if (!Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Texts must be a non-empty array',
        });
      }

      const result = await geminiService.batchTranslate(texts, sourceLang);

      return res.status(200).json({
        success: true,
        message: 'Batch translation successful',
        data: result,
      });
    } catch (error) {
      console.error('Batch translation error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/chat/conversation:
   *   post:
   *     summary: Chat với lịch sử hội thoại
   *     tags: [Chat & Translation]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *             properties:
   *               message:
   *                 type: string
   *                 description: Tin nhắn mới
   *                 example: "Bạn có thể giải thích thêm không?"
   *               history:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     userMessage:
   *                       type: string
   *                     aiResponse:
   *                       type: string
   *                 description: Lịch sử hội thoại trước đó
   *     responses:
   *       200:
   *         description: Chat thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   *       500:
   *         description: Lỗi server
   */
  async chatWithHistory(req, res, next) {
    try {
      const { message, history = [] } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Message is required and must be a non-empty string',
        });
      }

      const result = await geminiService.chatWithHistory(history, message);

      return res.status(200).json({
        success: true,
        message: 'Chat successful',
        data: result,
      });
    } catch (error) {
      console.error('Chat with history error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/chat/health:
   *   get:
   *     summary: Kiểm tra trạng thái của Gemini AI service
   *     tags: [Chat & Translation]
   *     responses:
   *       200:
   *         description: Service đang hoạt động
   *       500:
   *         description: Lỗi server
   */
  async checkHealth(req, res, next) {
    try {
      // Test API key bằng cách gửi một request đơn giản
      const testResult = await geminiService.translateToVietnamese('Hello', 'en');
      
      return res.status(200).json({
        success: true,
        message: 'Gemini AI service is healthy',
        data: {
          status: 'active',
          apiKeyConfigured: !!process.env.GEMINI_API_KEY,
          testTranslation: testResult.translatedText,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Health check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gemini AI service is not available',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = new ChatController();
