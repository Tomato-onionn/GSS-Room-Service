const MeetingHistoryService = require('../services/MeetingHistoryService');

class MeetingHistoryController {
  constructor() {
    this.meetingHistoryService = new MeetingHistoryService();
  }

  // @desc    Get completed and cancelled meeting history
  // @route   GET /api/meeting-history
  // @access  Public
  getCompletedAndCancelledHistory = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, user_id } = req.query;
      
      const result = await this.meetingHistoryService.getCompletedAndCancelledHistory(
        page,
        limit,
        user_id
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get history by room ID
  // @route   GET /api/meeting-history/room/:roomId
  // @access  Public
  getHistoryByRoomId = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      
      const history = await this.meetingHistoryService.getHistoryByRoomId(roomId);

      res.json({
        success: true,
        data: { history }
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get meeting history statistics
  // @route   GET /api/meeting-history/statistics
  // @access  Public
  getHistoryStatistics = async (req, res, next) => {
    try {
      const { user_id } = req.query;
      
      const stats = await this.meetingHistoryService.getHistoryStatistics(user_id);

      res.json({
        success: true,
        data: { statistics: stats }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = MeetingHistoryController;