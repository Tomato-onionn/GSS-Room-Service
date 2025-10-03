const MeetingRoomService = require('../services/MeetingRoomService');

class MeetingRoomController {
  constructor() {
    this.meetingRoomService = new MeetingRoomService();
  }

  // @desc    Get all meeting rooms
  // @route   GET /api/meeting-rooms
  // @access  Public
  getAllMeetingRooms = async (req, res, next) => {
    try {
      const result = await this.meetingRoomService.getAllMeetingRooms();

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get single meeting room
  // @route   GET /api/meeting-rooms/:id
  // @access  Public
  getMeetingRoomById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const room = await this.meetingRoomService.getMeetingRoomById(id);

      res.json({
        success: true,
        data: { room }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Create new meeting room
  // @route   POST /api/meeting-rooms
  // @access  Private
  createMeetingRoom = async (req, res, next) => {
    try {
      const { details = [], participants = [], ...roomData } = req.body;
      
      const room = await this.meetingRoomService.createMeetingRoom(
        roomData,
        details,
        participants
      );

      res.status(201).json({
        success: true,
        message: 'Meeting room created successfully',
        data: { room }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Update meeting room
  // @route   PUT /api/meeting-rooms/:id
  // @access  Private
  updateMeetingRoom = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { details, participants, ...roomData } = req.body;

      const room = await this.meetingRoomService.updateMeetingRoom(
        id,
        roomData,
        details,
        participants
      );

      res.json({
        success: true,
        message: 'Meeting room updated successfully',
        data: { room }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Update meeting room status
  // @route   PATCH /api/meeting-rooms/:id/status
  // @access  Private
  updateMeetingRoomStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const room = await this.meetingRoomService.updateMeetingRoomStatus(id, status);

      res.json({
        success: true,
        message: `Meeting room status updated to ${status}`,
        data: { room }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get user's meeting rooms
  // @route   GET /api/meeting-rooms/user/:userId
  // @access  Private
  getUserMeetingRooms = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.meetingRoomService.getMeetingRoomsByUser(userId, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = MeetingRoomController;