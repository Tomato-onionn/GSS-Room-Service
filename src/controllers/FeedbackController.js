const Feedback = require('../models/feedback');
const { Op } = require('sequelize');

class FeedbackController {
  /**
   * @swagger
   * /api/feedbacks:
   *   post:
   *     summary: Tạo feedback mới
   *     tags: [Feedbacks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - module_type
   *               - user_id
   *               - rating
   *             properties:
   *               module_type:
   *                 type: string
   *                 enum: [meeting_room, mentor, user, course, system, chatbot, other]
   *                 example: meeting_room
   *               module_id:
   *                 type: integer
   *                 example: 123
   *               user_id:
   *                 type: integer
   *                 example: 456
   *               rating:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *                 example: 5
   *               comment:
   *                 type: string
   *                 example: "Phòng họp rất tốt, tiện nghi đầy đủ"
   *     responses:
   *       201:
   *         description: Tạo feedback thành công
   *       400:
   *         description: Dữ liệu không hợp lệ
   */
  async createFeedback(req, res, next) {
    try {
      const { module_type, module_id, user_id, rating, comment } = req.body;

      const feedback = await Feedback.create({
        module_type,
        module_id,
        user_id,
        rating,
        comment,
        status: 'pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Feedback created successfully',
        data: feedback
      });
    } catch (error) {
      console.error('Create feedback error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks:
   *   get:
   *     summary: Lấy danh sách tất cả feedbacks
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, reviewed, resolved, archived]
   *       - in: query
   *         name: rating
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *     responses:
   *       200:
   *         description: Lấy danh sách thành công
   */
  async getAllFeedbacks(req, res, next) {
    try {
      const { page = 1, limit = 20, status, rating } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (rating) where.rating = parseInt(rating);

      const { count, rows } = await Feedback.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'Feedbacks retrieved successfully',
        data: {
          feedbacks: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all feedbacks error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/module/{moduleType}:
   *   get:
   *     summary: Lấy feedbacks theo module type
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: moduleType
   *         required: true
   *         schema:
   *           type: string
   *           enum: [meeting_room, mentor, user, course, system, chatbot, other]
   *       - in: query
   *         name: module_id
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lấy feedbacks thành công
   */
  async getFeedbacksByModule(req, res, next) {
    try {
      const { moduleType } = req.params;
      const { module_id } = req.query;

      const where = { module_type: moduleType };
      if (module_id) where.module_id = parseInt(module_id);

      const feedbacks = await Feedback.findAll({
        where,
        order: [['created_at', 'DESC']]
      });

      const count = feedbacks.length;

      // Tính toán average rating
      const avgRating = feedbacks.length > 0 
        ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length 
        : 0;

      // Get rating distribution
      const ratingDist = await Feedback.findAll({
        where,
        attributes: [
          'rating',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('rating')), 'count']
        ],
        group: ['rating'],
        order: [['rating', 'ASC']]
      });

      const ratingDistribution = ratingDist.reduce((acc, item) => {
        acc[`${item.rating}_star`] = parseInt(item.dataValues.count);
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        message: 'Module feedbacks retrieved successfully',
        data: {
          feedbacks,
          statistics: {
            total: count,
            averageRating: parseFloat(avgRating.toFixed(2)),
            ratingDistribution
          }
        }
      });
    } catch (error) {
      console.error('Get feedbacks by module error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/{id}:
   *   get:
   *     summary: Lấy chi tiết feedback theo ID
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lấy feedback thành công
   *       404:
   *         description: Không tìm thấy feedback
   */
  async getFeedbackById(req, res, next) {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Feedback retrieved successfully',
        data: feedback
      });
    } catch (error) {
      console.error('Get feedback by ID error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/{id}/respond:
   *   put:
   *     summary: Admin phản hồi feedback
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - admin_response
   *               - responded_by
   *             properties:
   *               admin_response:
   *                 type: string
   *                 example: "Cảm ơn feedback của bạn. Chúng tôi đã ghi nhận"
   *               responded_by:
   *                 type: integer
   *                 example: 1
   *               status:
   *                 type: string
   *                 enum: [pending, reviewed, resolved, archived]
   *                 example: reviewed
   *     responses:
   *       200:
   *         description: Phản hồi thành công
   */
  async respondToFeedback(req, res, next) {
    try {
      const { id } = req.params;
      const { admin_response, responded_by, status } = req.body;

      const feedback = await Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      await feedback.update({
        admin_response,
        responded_by,
        responded_at: new Date(),
        status: status || 'reviewed'
      });

      return res.status(200).json({
        success: true,
        message: 'Feedback responded successfully',
        data: feedback
      });
    } catch (error) {
      console.error('Respond to feedback error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/{id}:
   *   put:
   *     summary: Cập nhật feedback
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rating:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *               comment:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [pending, reviewed, resolved, archived]
   *     responses:
   *       200:
   *         description: Cập nhật thành công
   */
  async updateFeedback(req, res, next) {
    try {
      const { id } = req.params;
      const { rating, comment, status } = req.body;

      const feedback = await Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      const updateData = {};
      if (rating !== undefined) updateData.rating = rating;
      if (comment !== undefined) updateData.comment = comment;
      if (status !== undefined) updateData.status = status;

      await feedback.update(updateData);

      return res.status(200).json({
        success: true,
        message: 'Feedback updated successfully',
        data: feedback
      });
    } catch (error) {
      console.error('Update feedback error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/{id}:
   *   delete:
   *     summary: Xóa feedback
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Xóa thành công
   *       404:
   *         description: Không tìm thấy feedback
   */
  async deleteFeedback(req, res, next) {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findByPk(id);

      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: 'Feedback not found'
        });
      }

      await feedback.destroy();

      return res.status(200).json({
        success: true,
        message: 'Feedback deleted successfully'
      });
    } catch (error) {
      console.error('Delete feedback error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/user/{userId}:
   *   get:
   *     summary: Lấy tất cả feedbacks của một user
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: integer
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Lấy feedbacks thành công
   */
  async getFeedbacksByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Feedback.findAndCountAll({
        where: { user_id: parseInt(userId) },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        message: 'User feedbacks retrieved successfully',
        data: {
          feedbacks: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get feedbacks by user error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/statistics:
   *   get:
   *     summary: Lấy thống kê tổng quan về feedbacks
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: query
   *         name: module_type
   *         schema:
   *           type: string
   *       - in: query
   *         name: module_id
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lấy thống kê thành công
   */
  async getStatistics(req, res, next) {
    try {
      const { module_type, module_id } = req.query;
      
      const where = {};
      if (module_type) where.module_type = module_type;
      if (module_id) where.module_id = parseInt(module_id);

      const total = await Feedback.count({ where });
      const feedbacks = await Feedback.findAll({ where });

      const avgRating = feedbacks.length > 0
        ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
        : 0;

      // Get rating distribution
      const ratingDist = await Feedback.findAll({
        where,
        attributes: [
          'rating',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('rating')), 'count']
        ],
        group: ['rating'],
        order: [['rating', 'ASC']]
      });

      const ratingDistribution = ratingDist.reduce((acc, item) => {
        acc[`${item.rating}_star`] = parseInt(item.dataValues.count);
        return acc;
      }, {});
      
      const statusDistribution = await Feedback.findAll({
        where,
        attributes: [
          'status',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      const statusCounts = statusDistribution.reduce((acc, item) => {
        acc[item.status] = parseInt(item.dataValues.count);
        return acc;
      }, { pending: 0, responded: 0, archived: 0 });

      return res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          total,
          averageRating: parseFloat(avgRating.toFixed(2)),
          pending: statusCounts.pending,
          responded: statusCounts.responded,
          archived: statusCounts.archived,
          ratingCounts: ratingDistribution
        }
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/feedbacks/rating-distribution:
   *   get:
   *     summary: Lấy phân bố đánh giá theo rating
   *     tags: [Feedbacks]
   *     parameters:
   *       - in: query
   *         name: module_type
   *         schema:
   *           type: string
   *       - in: query
   *         name: module_id
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Lấy phân bố đánh giá thành công
   */
  async getRatingDistribution(req, res, next) {
    try {
      const { module_type, module_id } = req.query;
      
      const where = {};
      if (module_type) where.module_type = module_type;
      if (module_id) where.module_id = parseInt(module_id);

      const distribution = await Feedback.findAll({
        where,
        attributes: [
          'rating',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('rating')), 'count']
        ],
        group: ['rating'],
        order: [['rating', 'ASC']]
      });

      const ratingCounts = distribution.reduce((acc, item) => {
        acc[`${item.rating}_star`] = parseInt(item.dataValues.count);
        return acc;
      }, {});

      // Ensure all ratings from 1-5 are present
      for (let i = 1; i <= 5; i++) {
        if (!ratingCounts[`${i}_star`]) {
          ratingCounts[`${i}_star`] = 0;
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Rating distribution retrieved successfully',
        data: ratingCounts
      });
    } catch (error) {
      console.error('Get rating distribution error:', error);
      next(error);
    }
  }
}

module.exports = new FeedbackController();
