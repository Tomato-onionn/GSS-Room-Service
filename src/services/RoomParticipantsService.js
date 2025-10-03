const RoomParticipantsRepository = require('../repositories/RoomParticipantsRepository');

class RoomParticipantsService {
  constructor() {
    this.roomParticipantsRepo = new RoomParticipantsRepository();
  }

  async getParticipantsByRoomId(roomId) {
    const participants = await this.roomParticipantsRepo.findByRoomId(roomId);
    return participants;
  }

  async addParticipants(roomId, userIds) {
    // Kiểm tra xem room có tồn tại không
    const { Meetingroom } = require('../models');
    const room = await Meetingroom.findByPk(roomId);
    
    if (!room) {
      throw new Error('Meeting room not found');
    }

    // Thêm participants
    const participants = await this.roomParticipantsRepo.addParticipants(roomId, userIds);
    return participants;
  }

  async removeParticipant(roomId, userId) {
    const removed = await this.roomParticipantsRepo.removeParticipant(roomId, userId);
    
    if (removed === 0) {
      throw new Error('Participant not found in this room');
    }
    
    return { message: 'Participant removed successfully' };
  }

  async checkUserInRoom(roomId, userId) {
    const isInRoom = await this.roomParticipantsRepo.isUserInRoom(roomId, userId);
    return { isParticipant: isInRoom };
  }

  async getParticipantCount(roomId) {
    const count = await this.roomParticipantsRepo.getParticipantCount(roomId);
    return { count };
  }

  async getRoomsByUserId(userId) {
    const rooms = await this.roomParticipantsRepo.findByUserId(userId);
    return rooms;
  }
}

module.exports = RoomParticipantsService;