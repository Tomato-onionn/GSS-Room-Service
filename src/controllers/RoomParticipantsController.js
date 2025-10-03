const RoomParticipantsService = require('../services/RoomParticipantsService');

class RoomParticipantsController {
  constructor() {
    this.roomParticipantsService = new RoomParticipantsService();
  }

  // @desc    Get participants by room ID
  // @route   GET /api/room-participants/room/:roomId
  // @access  Public
  getParticipantsByRoomId = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      
      const participants = await this.roomParticipantsService.getParticipantsByRoomId(roomId);

      res.json({
        success: true,
        data: { participants }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Add participants to room
  // @route   POST /api/room-participants/room/:roomId
  // @access  Private
  addParticipants = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { userIds } = req.body;
      
      const participants = await this.roomParticipantsService.addParticipants(roomId, userIds);

      res.status(201).json({
        success: true,
        message: 'Participants added successfully',
        data: { participants }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Remove participant from room
  // @route   DELETE /api/room-participants/room/:roomId/user/:userId
  // @access  Private
  removeParticipant = async (req, res, next) => {
    try {
      const { roomId, userId } = req.params;
      
      const result = await this.roomParticipantsService.removeParticipant(roomId, userId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Check if user is in room
  // @route   GET /api/room-participants/room/:roomId/user/:userId/check
  // @access  Public
  checkUserInRoom = async (req, res, next) => {
    try {
      const { roomId, userId } = req.params;
      
      const result = await this.roomParticipantsService.checkUserInRoom(roomId, userId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get participant count for room
  // @route   GET /api/room-participants/room/:roomId/count
  // @access  Public
  getParticipantCount = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      
      const result = await this.roomParticipantsService.getParticipantCount(roomId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get rooms by user ID
  // @route   GET /api/room-participants/user/:userId
  // @access  Private
  getRoomsByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      const rooms = await this.roomParticipantsService.getRoomsByUserId(userId);

      res.json({
        success: true,
        data: { rooms }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = RoomParticipantsController;