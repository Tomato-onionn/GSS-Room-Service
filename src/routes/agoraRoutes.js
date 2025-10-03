const express = require('express');
const AgoraController = require('../controllers/AgoraController');

const router = express.Router();
const agoraController = new AgoraController();

/**
 * @swagger
 * tags:
 *   name: Agora
 *   description: Agora video calling and messaging endpoints
 */

/**
 * @swagger
 * /api/agora/tokens:
 *   post:
 *     summary: Generate Agora RTC and RTM tokens
 *     tags: [Agora]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - uid
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: Meeting room ID
 *               uid:
 *                 type: integer
 *                 description: User ID for Agora
 *               userName:
 *                 type: string
 *                 description: User display name
 *               role:
 *                 type: string
 *                 enum: [publisher, subscriber]
 *                 default: publisher
 *                 description: User role in the channel
 *     responses:
 *       200:
 *         description: Tokens generated successfully
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
 *                     rtcToken:
 *                       type: string
 *                     rtmToken:
 *                       type: string
 *                     appId:
 *                       type: string
 *                     channelName:
 *                       type: string
 *                     uid:
 *                       type: integer
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 */
router.post('/tokens', agoraController.generateTokens);

/**
 * @swagger
 * /api/agora/rooms/{roomId}/join:
 *   post:
 *     summary: Join meeting room and get tokens
 *     tags: [Agora]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - userName
 *             properties:
 *               uid:
 *                 type: integer
 *                 description: User ID for Agora
 *               userName:
 *                 type: string
 *                 description: User display name
 *               userId:
 *                 type: integer
 *                 description: Application user ID
 *     responses:
 *       200:
 *         description: Joined room successfully
 */
router.post('/rooms/:roomId/join', agoraController.joinRoom);

/**
 * @swagger
 * /api/agora/rooms/{roomId}/leave:
 *   post:
 *     summary: Leave meeting room
 *     tags: [Agora]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - userName
 *             properties:
 *               uid:
 *                 type: integer
 *                 description: User ID for Agora
 *               userName:
 *                 type: string
 *                 description: User display name
 *     responses:
 *       200:
 *         description: Left room successfully
 */
router.post('/rooms/:roomId/leave', agoraController.leaveRoom);

/**
 * @swagger
 * /api/agora/rooms/{roomId}/participants:
 *   get:
 *     summary: Get room participants
 *     tags: [Agora]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting room ID
 *     responses:
 *       200:
 *         description: Participants retrieved successfully
 */
router.get('/rooms/:roomId/participants', agoraController.getRoomParticipants);

/**
 * @swagger
 * /api/agora/tokens/refresh:
 *   post:
 *     summary: Refresh Agora tokens
 *     tags: [Agora]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - uid
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: Meeting room ID
 *               uid:
 *                 type: integer
 *                 description: User ID for Agora
 *               role:
 *                 type: string
 *                 enum: [publisher, subscriber]
 *                 default: publisher
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 */
router.post('/tokens/refresh', agoraController.refreshTokens);

module.exports = router;