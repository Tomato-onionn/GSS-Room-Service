const express = require('express');
const MeetingHistoryController = require('../controllers/MeetingHistoryController');

const router = express.Router();
const meetingHistoryController = new MeetingHistoryController();

/**
 * @swagger
 * tags:
 *   name: Meeting History
 *   description: Meeting history management endpoints
 */

/**
 * @swagger
 * /api/meeting-history:
 *   get:
 *     summary: Get completed and cancelled meeting history
 *     tags: [Meeting History]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Meeting history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MeetingHistory'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */
router.get('/', meetingHistoryController.getCompletedAndCancelledHistory);

/**
 * @swagger
 * /api/meeting-history/room/{roomId}:
 *   get:
 *     summary: Get history by room ID
 *     tags: [Meeting History]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room history retrieved successfully
 */
router.get('/room/:roomId', meetingHistoryController.getHistoryByRoomId);

/**
 * @swagger
 * /api/meeting-history/statistics:
 *   get:
 *     summary: Get meeting history statistics
 *     tags: [Meeting History]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         completed:
 *                           type: integer
 *                         canceled:
 *                           type: integer
 *                         total:
 *                           type: integer
 */
router.get('/statistics', meetingHistoryController.getHistoryStatistics);

module.exports = router;