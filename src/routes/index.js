const express = require('express');
const meetingRoomRoutes = require('./meetingRoomRoutes');
const meetingHistoryRoutes = require('./meetingHistoryRoutes');
const roomParticipantsRoutes = require('./roomParticipantsRoutes');
const adminRoutes = require('./adminRoutes');
const agoraRoutes = require('./agoraRoutes');
const SocketService = require('../services/SocketService');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MeetingRoom:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         room_name:
 *           type: string
 *         mentor_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [scheduled, ongoing, completed, canceled]
 *         actual_start_time:
 *           type: string
 *           format: date-time
 *     MeetingHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         room_id:
 *           type: integer
 *         room_name:
 *           type: string
 *         mentor_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         actual_start_time:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [completed, canceled]
 *     RoomParticipant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         room_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         joined_at:
 *           type: string
 *           format: date-time
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 */

// API Routes
router.use('/meeting-rooms', meetingRoomRoutes);
router.use('/meeting-history', meetingHistoryRoutes);
router.use('/room-participants', roomParticipantsRoutes);
router.use('/admin', adminRoutes);
router.use('/agora', agoraRoutes);

// Debug route for socket rooms
router.get('/debug/rooms', (req, res) => {
  try {
    const rooms = SocketService.getAllRooms();
    res.json({
      success: true,
      data: {
        totalRooms: Object.keys(rooms).length,
        rooms: rooms
      }
    });
  } catch (error) {
    console.error('Error getting debug room info:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting room debug info'
    });
  }
});

module.exports = router;