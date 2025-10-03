const BaseRepository = require('./BaseRepository');
const { RoomParticipants, Meetingroom } = require('../models');

class RoomParticipantsRepository extends BaseRepository {
  constructor() {
    super(RoomParticipants);
  }

  async findByRoomId(roomId) {
    return await this.model.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: Meetingroom,
          as: 'room'
        }
      ]
    });
  }

  async findByUserId(userId) {
    return await this.model.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Meetingroom,
          as: 'room'
        }
      ]
    });
  }

  async addParticipants(roomId, userIds) {
    const participants = userIds.map(userId => ({
      room_id: roomId,
      user_id: userId,
      joined_at: new Date()
    }));
    
    return await this.bulkCreate(participants, {
      ignoreDuplicates: true // Tránh duplicate participants
    });
  }

  async removeParticipant(roomId, userId) {
    return await this.model.destroy({
      where: {
        room_id: roomId,
        user_id: userId
      }
    });
  }

  async isUserInRoom(roomId, userId) {
    const participant = await this.model.findOne({
      where: {
        room_id: roomId,
        user_id: userId
      }
    });
    
    return !!participant;
  }

  async getParticipantCount(roomId) {
    return await this.model.count({
      where: { room_id: roomId }
    });
  }

  async removeAllParticipants(roomId) {
    return await this.model.destroy({
      where: { room_id: roomId }
    });
  }
}

module.exports = RoomParticipantsRepository;