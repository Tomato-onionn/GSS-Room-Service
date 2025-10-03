const MeetingRoomRepository = require('../repositories/MeetingRoomRepository');
const MeetingRoomDetailRepository = require('../repositories/MeetingRoomDetailRepository');
const RoomParticipantsRepository = require('../repositories/RoomParticipantsRepository');
const MeetingHistoryRepository = require('../repositories/MeetingHistoryRepository');
const { sequelize } = require('../models');

class MeetingRoomService {
  constructor() {
    this.meetingRoomRepo = new MeetingRoomRepository();
    this.meetingRoomDetailRepo = new MeetingRoomDetailRepository();
    this.roomParticipantsRepo = new RoomParticipantsRepository();
    this.meetingHistoryRepo = new MeetingHistoryRepository();
  }

  async getAllMeetingRooms() {
    const rooms = await this.meetingRoomRepo.findAndCountAll({
      include: [
        {
          model: require('../models').Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: require('../models').RoomParticipants,
          as: 'room_participants'
        }
      ],
      order: [['start_time', 'DESC']]
    });

    return {
      rooms: rooms.rows,
      total: rooms.count
    };
  }

  async getMeetingRoomById(id) {
    const room = await this.meetingRoomRepo.findByIdWithDetails(id);
    
    if (!room) {
      throw new Error('Meeting room not found');
    }
    
    return room;
  }

  async createMeetingRoom(roomData, details = null, participants = []) {
    const transaction = await sequelize.transaction();
    
    try {
      // Tạo meeting room
      const newRoom = await this.meetingRoomRepo.create(roomData);
      
      // TỰ ĐỘNG TẠO MEETING LINK với room ID thực
      const autoMeetingLink = `http://localhost:5173/meeting/${newRoom.id}`;
      
      // Thêm details với meeting_link tự động
      if (details || true) { // Luôn tạo details
        const detailsData = details || {};
        await this.meetingRoomDetailRepo.create({
          room_id: newRoom.id,
          meeting_link: detailsData.meeting_link || autoMeetingLink, // Dùng auto link nếu không có
          meeting_password: detailsData.meeting_password || null,
          notes: detailsData.notes || null,
          recorded_url: detailsData.recorded_url || null
        });
      }
      
      // Thêm participants nếu có
      if (participants.length > 0) {
        await this.roomParticipantsRepo.addParticipants(newRoom.id, participants);
      }
      
      await transaction.commit();
      
      // Lấy lại room với đầy đủ thông tin
      return await this.getMeetingRoomById(newRoom.id);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateMeetingRoom(id, roomData, details = null, participants = null) {
    const transaction = await sequelize.transaction();
    
    try {
      const existingRoom = await this.meetingRoomRepo.findById(id);
      if (!existingRoom) {
        throw new Error('Meeting room not found');
      }
      
      // Cập nhật room
      const updatedRoom = await this.meetingRoomRepo.update(id, roomData);
      
      // Cập nhật details nếu có
      if (details !== null) {
        // Tìm detail hiện tại
        const existingDetail = await this.meetingRoomDetailRepo.findByRoomId(id);
        
        if (existingDetail.length > 0) {
          // Cập nhật detail hiện tại
          await this.meetingRoomDetailRepo.update(existingDetail[0].id, {
            meeting_link: details.meeting_link,
            meeting_password: details.meeting_password || null,
            notes: details.notes || null,
            recorded_url: details.recorded_url || null
          });
        } else {
          // Tạo detail mới
          await this.meetingRoomDetailRepo.create({
            room_id: id,
            meeting_link: details.meeting_link,
            meeting_password: details.meeting_password || null,
            notes: details.notes || null,
            recorded_url: details.recorded_url || null
          });
        }
      }
      
      // Cập nhật participants nếu có
      if (participants !== null) {
        await this.roomParticipantsRepo.removeAllParticipants(id);
        if (participants.length > 0) {
          await this.roomParticipantsRepo.addParticipants(id, participants);
        }
      }
      
      await transaction.commit();
      
      return await this.getMeetingRoomById(id);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateMeetingRoomStatus(id, status) {
    const room = await this.meetingRoomRepo.findById(id);
    if (!room) {
      throw new Error('Meeting room not found');
    }

    // Nếu chuyển từ ongoing sang completed hoặc canceled, tạo history record
    if ((status === 'completed' || status === 'canceled') && 
        (room.status === 'ongoing' || room.status === 'scheduled')) {
      
      const transaction = await sequelize.transaction();
      
      try {
        // Cập nhật status
        const updatedRoom = await this.meetingRoomRepo.updateStatus(id, status);
        
        // Tạo history record
        await this.meetingHistoryRepo.createFromMeetingRoom(updatedRoom);
        
        await transaction.commit();
        
        return updatedRoom;
        
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    
    return await this.meetingRoomRepo.updateStatus(id, status);
  }

  async getMeetingRoomsByUser(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await this.meetingRoomRepo.findAndCountAll({
      where: {
        [require('sequelize').Op.or]: [
          { user_id: userId },
          { mentor_id: userId }
        ]
      },
      include: [
        {
          model: require('../models').Meetingroomdetail,
          as: 'meetingroomdetails'
        },
        {
          model: require('../models').RoomParticipants,
          as: 'room_participants'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['start_time', 'DESC']]
    });

    return {
      rooms: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    };
  }

  async autoCompleteOngoingRooms() {
    const roomsToComplete = await this.meetingRoomRepo.findRoomsReadyToComplete();
    
    const completedRooms = [];
    
    for (const room of roomsToComplete) {
      try {
        const completedRoom = await this.updateMeetingRoomStatus(room.id, 'completed');
        completedRooms.push(completedRoom);
      } catch (error) {
        console.error(`Error completing room ${room.id}:`, error);
      }
    }
    
    return completedRooms;
  }
}

module.exports = MeetingRoomService;