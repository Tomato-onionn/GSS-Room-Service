const agoraConfig = require('../config/agora');
const MeetingRoomService = require('../services/MeetingRoomService');
const SocketService = require('../services/SocketService');

class AgoraController {
  constructor() {
    this.agoraConfig = agoraConfig;
    this.meetingRoomService = new MeetingRoomService();
  }

  // @desc    Generate Agora tokens for room
  // @route   POST /api/agora/tokens
  // @access  Public
  generateTokens = async (req, res, next) => {
    try {
      const { roomId, uid, userName, role = 'publisher' } = req.body;

      if (!roomId || !uid) {
        return res.status(400).json({
          success: false,
          message: 'Room ID and UID are required'
        });
      }

      // Verify room exists
      const room = await this.meetingRoomService.getMeetingRoomById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Meeting room not found'
        });
      }

      // Use roomId directly as channel name to match frontend
      const channelName = roomId;
      
      // Generate tokens
      const tokens = this.agoraConfig.generateTokens(channelName, parseInt(uid), role);

      res.json({
        success: true,
        data: {
          ...tokens,
          roomId,
          userName
        }
      });

      console.log(`🎫 Generated tokens for user ${userName} (${uid}) in room ${roomId}`);
    } catch (error) {
      next(error);
    }
  };

  // @desc    Join room and get tokens
  // @route   POST /api/agora/rooms/:roomId/join
  // @access  Public
  joinRoom = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { uid, userName, userId } = req.body;

      if (!uid || !userName) {
        return res.status(400).json({
          success: false,
          message: 'UID and userName are required'
        });
      }

      // Verify room exists and update status if needed
      const room = await this.meetingRoomService.getMeetingRoomById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Meeting room not found'
        });
      }

      // Update room status to ongoing if it's scheduled
      if (room.status === 'scheduled') {
        await this.meetingRoomService.updateMeetingRoomStatus(roomId, 'ongoing');
      }

      // Generate tokens
      const channelName = this.agoraConfig.sanitizeChannelName(`room_${roomId}`);
      const tokens = this.agoraConfig.generateTokens(channelName, parseInt(uid), 'publisher');

      // Add participant to room tracking via Socket.IO
      const participantData = {
        roomId,
        userName,
        userId: userId || uid,
        uid: parseInt(uid),
        joinedAt: new Date()
      };

      res.json({
        success: true,
        message: 'Joined room successfully',
        data: {
          ...tokens,
          roomId,
          userName,
          participant: participantData
        }
      });

      console.log(`👤 User ${userName} (${uid}) joined room ${roomId}`);
    } catch (error) {
      next(error);
    }
  };

  // @desc    Leave room
  // @route   POST /api/agora/rooms/:roomId/leave
  // @access  Public
  leaveRoom = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { uid, userName } = req.body;

      // Verify room exists
      const room = await this.meetingRoomService.getMeetingRoomById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Meeting room not found'
        });
      }

      // Get current participants from Socket.IO
      const participants = SocketService.getRoomParticipants(roomId);
      
      // Check if this is the last participant
      const remainingParticipants = participants.filter(p => p.socketId !== req.socket?.id);
      
      // If room is empty and ongoing, mark as completed
      if (remainingParticipants.length === 0 && room.status === 'ongoing') {
        await this.meetingRoomService.updateMeetingRoomStatus(roomId, 'completed');
      }

      res.json({
        success: true,
        message: 'Left room successfully',
        data: {
          roomId,
          userName,
          uid
        }
      });

      console.log(`👤 User ${userName} (${uid}) left room ${roomId}`);
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get room participants
  // @route   GET /api/agora/rooms/:roomId/participants
  // @access  Public
  getRoomParticipants = async (req, res, next) => {
    try {
      const { roomId } = req.params;

      // Verify room exists
      const room = await this.meetingRoomService.getMeetingRoomById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Meeting room not found'
        });
      }

      // Get participants from Socket.IO
      const participants = SocketService.getRoomParticipants(roomId);

      res.json({
        success: true,
        data: {
          roomId,
          participants,
          count: participants.length
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Refresh tokens
  // @route   POST /api/agora/tokens/refresh
  // @access  Public
  refreshTokens = async (req, res, next) => {
    try {
      const { roomId, uid, role = 'publisher' } = req.body;

      if (!roomId || !uid) {
        return res.status(400).json({
          success: false,
          message: 'Room ID and UID are required'
        });
      }

      // Generate new tokens
      const channelName = this.agoraConfig.sanitizeChannelName(`room_${roomId}`);
      const tokens = this.agoraConfig.generateTokens(channelName, parseInt(uid), role);

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens
      });

      console.log(`🔄 Refreshed tokens for UID ${uid} in room ${roomId}`);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AgoraController;