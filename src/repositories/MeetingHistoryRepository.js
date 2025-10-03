const BaseRepository = require('./BaseRepository');
const { Meetinghistory, Meetingroom } = require('../models');
const { Op } = require('sequelize');

class MeetingHistoryRepository extends BaseRepository {
  constructor() {
    super(Meetinghistory);
  }

  async findCompletedAndCancelledMeetings(options = {}) {
    const { page = 1, limit = 10, userId } = options;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    // Nếu có userId, lọc theo user
    if (userId) {
      whereClause['$room.user_id$'] = userId;
    }

    return await this.model.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Meetingroom,
          as: 'room',
          where: {
            status: { [Op.in]: ['completed', 'canceled'] }
          },
          required: true
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
  }

  async findHistoryByRoomId(roomId) {
    return await this.model.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: Meetingroom,
          as: 'room'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async createFromMeetingRoom(meetingRoom) {
    return await this.create({
      room_id: meetingRoom.id,
      room_name: meetingRoom.room_name,
      mentor_id: meetingRoom.mentor_id,
      user_id: meetingRoom.user_id,
      start_time: meetingRoom.start_time,
      end_time: meetingRoom.end_time,
      actual_start_time: meetingRoom.actual_start_time,
      status: meetingRoom.status
    });
  }

  async getStatistics(userId = null) {
    const whereClause = userId ? { '$room.user_id$': userId } : {};
    
    const completed = await this.model.count({
      where: whereClause,
      include: [
        {
          model: Meetingroom,
          as: 'room',
          where: { status: 'completed' },
          required: true
        }
      ]
    });

    const canceled = await this.model.count({
      where: whereClause,
      include: [
        {
          model: Meetingroom,
          as: 'room',
          where: { status: 'canceled' },
          required: true
        }
      ]
    });

    return { completed, canceled, total: completed + canceled };
  }
}

module.exports = MeetingHistoryRepository;