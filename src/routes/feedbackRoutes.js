const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');
const validate = require('../middleware/validate');
const {
  createFeedbackSchema,
  updateFeedbackSchema,
  respondFeedbackSchema,
  queryParamsSchema
} = require('../validations/feedbackValidation');

/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: API endpoints for feedback management system
 */

/**
 * POST /api/feedbacks
 * Tạo feedback mới
 */
router.post(
  '/',
  validate(createFeedbackSchema),
  feedbackController.createFeedback
);

/**
 * GET /api/feedbacks
 * Lấy danh sách tất cả feedbacks (có phân trang và filter)
 */
router.get(
  '/',
  validate(queryParamsSchema, 'query'),
  feedbackController.getAllFeedbacks
);

/**
 * GET /api/feedbacks/statistics
 * Lấy thống kê tổng quan về feedbacks
 */
router.get(
  '/statistics',
  feedbackController.getStatistics
);

/**
 * GET /api/feedbacks/module/:moduleType
 * Lấy feedbacks theo module type (meeting_room, mentor, user, course, system, chatbot, other)
 */
router.get(
  '/module/:moduleType',
  validate(queryParamsSchema, 'query'),
  feedbackController.getFeedbacksByModule
);

/**
 * GET /api/feedbacks/user/:userId
 * Lấy tất cả feedbacks của một user
 */
router.get(
  '/user/:userId',
  validate(queryParamsSchema, 'query'),
  feedbackController.getFeedbacksByUser
);

/**
 * GET /api/feedbacks/:id
 * Lấy chi tiết feedback theo ID
 */
router.get(
  '/:id',
  feedbackController.getFeedbackById
);

/**
 * PUT /api/feedbacks/:id/respond
 * Admin phản hồi feedback
 */
router.put(
  '/:id/respond',
  validate(respondFeedbackSchema),
  feedbackController.respondToFeedback
);

/**
 * PUT /api/feedbacks/:id
 * Cập nhật feedback
 */
router.put(
  '/:id',
  validate(updateFeedbackSchema),
  feedbackController.updateFeedback
);

/**
 * DELETE /api/feedbacks/:id
 * Xóa feedback
 */
router.delete(
  '/:id',
  feedbackController.deleteFeedback
);

module.exports = router;
