const express = require('express');
const RoomParticipantsController = require('../controllers/RoomParticipantsController');
const validate = require('../middleware/validate');
const { addParticipantsSchema } = require('../validations/meetingRoomValidation');

const router = express.Router();
const roomParticipantsController = new RoomParticipantsController();

/**
 * @swagger
 * tags:
 *   name: Room Participants
 *   description: Room participants management endpoints
 */

/**
 * @swagger
 * /api/room-participants/room/{roomId}:
 *   get:
 *     summary: Get participants by room ID
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Participants retrieved successfully
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
 *                     participants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RoomParticipant'
 */
router.get('/room/:roomId', roomParticipantsController.getParticipantsByRoomId);

/**
 * @swagger
 * /api/room-participants/room/{roomId}:
 *   post:
 *     summary: Add participants to room
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Participants added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room not found
 */
router.post('/room/:roomId', validate(addParticipantsSchema), roomParticipantsController.addParticipants);

/**
 * @swagger
 * /api/room-participants/room/{roomId}/user/{userId}:
 *   delete:
 *     summary: Remove participant from room
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Participant removed successfully
 *       404:
 *         description: Participant not found in room
 */
router.delete('/room/:roomId/user/:userId', roomParticipantsController.removeParticipant);

/**
 * @swagger
 * /api/room-participants/room/{roomId}/user/{userId}/check:
 *   get:
 *     summary: Check if user is in room
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Check result
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
 *                     isParticipant:
 *                       type: boolean
 */
router.get('/room/:roomId/user/:userId/check', roomParticipantsController.checkUserInRoom);

/**
 * @swagger
 * /api/room-participants/room/{roomId}/count:
 *   get:
 *     summary: Get participant count for room
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant count retrieved
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
 *                     count:
 *                       type: integer
 */
router.get('/room/:roomId/count', roomParticipantsController.getParticipantCount);

/**
 * @swagger
 * /api/room-participants/user/{userId}:
 *   get:
 *     summary: Get rooms by user ID
 *     tags: [Room Participants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's rooms retrieved successfully
 */
router.get('/user/:userId', roomParticipantsController.getRoomsByUserId);

module.exports = router;