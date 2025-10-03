const MeetingHistoryRepository = require('../repositories/MeetingHistoryRepository');

class MeetingHistoryService {
  constructor() {
    this.meetingHistoryRepo = new MeetingHistoryRepository();
  }

  async getCompletedAndCancelledHistory(page = 1, limit = 10, userId = null) {
    const { count, rows } = await this.meetingHistoryRepo.findCompletedAndCancelledMeetings({
      page,
      limit,
      userId
    });

    return {
      history: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  async getHistoryByRoomId(roomId) {
    const history = await this.meetingHistoryRepo.findHistoryByRoomId(roomId);
    return history;
  }

  async getHistoryStatistics(userId = null) {
    const stats = await this.meetingHistoryRepo.getStatistics(userId);
    return stats;
  }

  async createHistoryRecord(meetingRoom) {
    return await this.meetingHistoryRepo.createFromMeetingRoom(meetingRoom);
  }
}

module.exports = MeetingHistoryService;