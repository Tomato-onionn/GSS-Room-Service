const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');
const validate = require('../middleware/validate');
const {
  translateSchema,
  chatSchema,
  detectLanguageSchema,
  batchTranslateSchema,
  chatWithHistorySchema,
} = require('../validations/chatValidation');

/**
 * @swagger
 * tags:
 *   name: Chat & Translation
 *   description: API endpoints for AI chat and translation services
 */

/**
 * POST /api/chat/translate
 * Dịch văn bản từ tiếng Anh hoặc tiếng Trung sang tiếng Việt
 */
router.post('/translate', validate(translateSchema), chatController.translate);

/**
 * POST /api/chat/message
 * Chat với AI Gemini (hỗ trợ dịch thuật)
 */
router.post('/message', validate(chatSchema), chatController.chat);

/**
 * POST /api/chat/detect-language
 * Phát hiện ngôn ngữ của văn bản
 */
router.post('/detect-language', validate(detectLanguageSchema), chatController.detectLanguage);

/**
 * POST /api/chat/batch-translate
 * Dịch nhiều văn bản cùng lúc
 */
router.post('/batch-translate', validate(batchTranslateSchema), chatController.batchTranslate);

/**
 * POST /api/chat/conversation
 * Chat với lịch sử hội thoại
 */
router.post('/conversation', validate(chatWithHistorySchema), chatController.chatWithHistory);

/**
 * GET /api/chat/health
 * Kiểm tra trạng thái của Gemini AI service
 */
router.get('/health', chatController.checkHealth);

module.exports = router;
