const express = require('express');
const MeetingRoomController = require('../controllers/meetingRoomController');
const validate = require('../middleware/validate');
const {
  createMeetingRoomSchema,
  updateMeetingRoomSchema,
  updateStatusSchema
} = require('../validations/meetingRoomValidation');

const router = express.Router();
const meetingRoomController = new MeetingRoomController();

/**
 * @swagger
 * tags:
 *   name: Meeting Rooms
 *   description: Meeting room management endpoints
 */

/**
 * @swagger
 * /api/meeting-rooms:
 *   get:
 *     summary: Get all meeting rooms
 *     tags: [Meeting Rooms]
 *     responses:
 *       200:
 *         description: List of meeting rooms retrieved successfully
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
 *                     rooms:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MeetingRoom'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 */
router.get('/', meetingRoomController.getAllMeetingRooms);

/**
 * @swagger
 * /api/meeting-rooms/{id}:
 *   get:
 *     summary: Get meeting room by ID
 *     tags: [Meeting Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meeting room ID
 *     responses:
 *       200:
 *         description: Meeting room retrieved successfully
 *       404:
 *         description: Meeting room not found
 */
router.get('/:id', meetingRoomController.getMeetingRoomById);

/**
 * @swagger
 * /api/meeting-rooms:
 *   post:
 *     summary: Create new meeting room
 *     tags: [Meeting Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_name
 *               - mentor_id
 *               - user_id
 *               - start_time
 *             properties:
 *               room_name:
 *                 type: string
 *                 example: "Team Meeting Room"
 *               mentor_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T10:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T11:00:00Z"
 *               details:
 *                 type: object
 *                 properties:
 *                   meeting_link:
 *                     type: string
 *                     format: uri
 *                     example: ""
 *                   meeting_password:
 *                     type: string
 *                     example: ""
 *                   notes:
 *                     type: string
 *                     example: "Important team meeting"
 *                   recorded_url:
 *                     type: string
 *                     format: uri
 *                     example: "https://recording.zoom.us/123"
 *               participants:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Meeting room created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', meetingRoomController.createMeetingRoom);

/**
 * @swagger
 * /api/meeting-rooms/{id}:
 *   put:
 *     summary: Update meeting room
 *     tags: [Meeting Rooms]
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
 *             properties:
 *               room_name:
 *                 type: string
 *               mentor_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               details:
 *                 type: object
 *                 properties:
 *                   meeting_link:
 *                     type: string
 *                     format: uri
 *                   meeting_password:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   recorded_url:
 *                     type: string
 *                     format: uri
 *               participants:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Meeting room updated successfully
 *       404:
 *         description: Meeting room not found
 */
router.put('/:id', meetingRoomController.updateMeetingRoom);

/**
 * @swagger
 * /api/meeting-rooms/{id}/status:
 *   patch:
 *     summary: Update meeting room status
 *     tags: [Meeting Rooms]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, canceled]
 *                 example: "ongoing"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Meeting room not found
 */
router.patch('/:id/status', meetingRoomController.updateMeetingRoomStatus);

/**
 * @swagger
 * /api/meeting-rooms/user/{userId}:
 *   get:
 *     summary: Get user's meeting rooms
 *     tags: [Meeting Rooms]
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
 *           default: 10
 *     responses:
 *       200:
 *         description: User's meeting rooms retrieved successfully
 */
router.get('/user/:userId', meetingRoomController.getUserMeetingRooms);

module.exports = router;