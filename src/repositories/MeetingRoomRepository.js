const BaseRepository = require('./BaseRepository');
const { Meetingroom, Meetingroomdetail, RoomParticipants, Meetinghistory } = require('../models');
const { Op } = require('sequelize');

class MeetingRoomRepository extends BaseRepository {
  constructor() {
    super(Meetingroom);
  }

  async findAllWithDetails(options = {}) {
    return await this.model.findAll({
      include: [
        {
          model: Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: RoomParticipants,
          as: 'room_participants'
        }
      ],
      ...options
    });
  }

  async findByIdWithDetails(id) {
    return await this.model.findByPk(id, {
      include: [
        {
          model: Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: RoomParticipants,
          as: 'room_participants'
        }
      ]
    });
  }

  async findOngoingRooms() {
    return await this.model.findAll({
      where: {
        status: 'ongoing'
      },
      include: [
        {
          model: Meetingroomdetail,
          as: 'meetingroomdetails'
        }
      ]
    });
  }

  async findRoomsByStatus(status) {
    return await this.model.findAll({
      where: { status },
      include: [
        {
          model: Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: RoomParticipants,
          as: 'room_participants'
        }
      ],
      order: [['start_time', 'DESC']]
    });
  }

  async findRoomsByUser(userId) {
    return await this.model.findAll({
      where: {
        [Op.or]: [
          { user_id: userId },
          { mentor_id: userId }
        ]
      },
      include: [
        {
          model: Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: RoomParticipants,
          as: 'room_participants'
        }
      ],
      order: [['start_time', 'DESC']]
    });
  }

  async findRoomsReadyToComplete() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    return await this.model.findAll({
      where: {
        status: 'ongoing',
        actual_start_time: {
          [Op.lte]: oneHourAgo
        }
      }
    });
  }

  async updateStatus(id, status, additionalData = {}) {
    const updateData = { status, ...additionalData };
    
    if (status === 'ongoing') {
      updateData.actual_start_time = new Date();
    }
    
    return await this.update(id, updateData);
  }
}

module.exports = MeetingRoomRepository;