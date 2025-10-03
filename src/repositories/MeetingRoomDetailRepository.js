const BaseRepository = require('./BaseRepository');
const { Meetingroomdetail, Meetingroom } = require('../models');

class MeetingRoomDetailRepository extends BaseRepository {
  constructor() {
    super(Meetingroomdetail);
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

  async findByRoomIdAndType(roomId, type) {
    // Không còn detail_type, function này không cần thiết
    // Chỉ tìm theo room_id
    return await this.model.findAll({
      where: { 
        room_id: roomId
      }
    });
  }

  async createMultiple(roomId, details) {
    const detailsWithRoomId = details.map(detail => ({
      ...detail,
      room_id: roomId
    }));
    
    return await this.bulkCreate(detailsWithRoomId);
  }

  async updateByRoomId(roomId, details) {
    // Xóa các detail cũ và tạo mới
    await this.model.destroy({
      where: { room_id: roomId }
    });
    
    return await this.createMultiple(roomId, details);
  }

  async findDetailsByType(type) {
    // Không còn detail_type, trả về tất cả details
    return await this.model.findAll({
      include: [
        {
          model: Meetingroom,
          as: 'room'
        }
      ]
    });
  }
}

module.exports = MeetingRoomDetailRepository;