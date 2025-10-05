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
      // Prepare data to create meeting room. Ensure start_time exists to satisfy DB constraints.
      const createData = { ...roomData };
      const now = new Date();

      // If user provided start_time, validate it; if missing or invalid, default to now.
      if (createData.start_time) {
        const parsed = new Date(createData.start_time);
        if (isNaN(parsed.getTime())) {
          console.warn('Invalid start_time provided, falling back to now');
          createData.start_time = now;
        } else {
          createData.start_time = parsed;
        }
      } else {
        createData.start_time = now;
      }

      // If status is 'ongoing' at creation, also set actual_start_time = start_time
      if (createData.status === 'ongoing') {
        createData.actual_start_time = createData.start_time;
      }

      // Set end_time: if actual_start_time exists use it, otherwise use start_time
      const baseForEnd = createData.actual_start_time || createData.start_time;
      if (baseForEnd) {
        createData.end_time = new Date(new Date(baseForEnd).getTime() + 60 * 60 * 1000);
      }

      // Tạo meeting room
      const newRoom = await this.meetingRoomRepo.create(createData);
      
      // TỰ ĐỘNG TẠO MEETING LINK: sử dụng mã ngẫu nhiên giống Google Meet
      const { generateMeetingCode } = require('../utils/meetingCode');
      const baseUrl = process.env.MEETING_BASE_URL || 'http://localhost:5173/meeting';

      // Try to generate a unique code (check DB) to avoid collisions
      const MAX_ATTEMPTS = 10;
      let attempts = 0;
      let code;
      let exists = null;

      do {
        if (attempts >= MAX_ATTEMPTS) {
          throw new Error('Unable to generate unique meeting code, please try again later');
        }

        code = generateMeetingCode();
        // Check if any existing meeting_link contains this code
        exists = await this.meetingRoomDetailRepo.findByMeetingLinkCode(code);
        attempts++;
      } while (exists);

      const autoMeetingLink = `${baseUrl}/${code}`;
      const autoMeetingCode = code; // store only this code in DB

      // (start_time and actual_start_time already set on create if needed)

      // Thêm details với meeting_link chỉ lưu mã (không lưu cả URL)
      if (details || true) { // Luôn tạo details
        const detailsData = details || {};

        // Normalize meeting_link: if client provided a full URL, extract last path segment
        let storedMeetingLink = autoMeetingCode;
        if (detailsData.meeting_link) {
          try {
            const url = new URL(detailsData.meeting_link);
            const parts = url.pathname.split('/').filter(Boolean);
            storedMeetingLink = parts.length > 0 ? parts[parts.length - 1] : detailsData.meeting_link;
          } catch (e) {
            // Not a URL, store as provided (assume it's the code)
            storedMeetingLink = detailsData.meeting_link;
          }
        }

        await this.meetingRoomDetailRepo.create({
          room_id: newRoom.id,
          // Save only the code segment, not full web link
          meeting_link: storedMeetingLink,
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
      
      // Nếu client cập nhật start_time mà không kèm end_time, tự động đặt end_time = start_time + 1 giờ
      if (roomData && roomData.start_time && !roomData.end_time) {
        const parsed = new Date(roomData.start_time);
        if (isNaN(parsed.getTime())) {
          console.warn('Invalid start_time provided in update, falling back to now');
          const fallback = new Date();
          roomData.start_time = fallback;
          roomData.end_time = new Date(fallback.getTime() + 60 * 60 * 1000);
        } else {
          roomData.start_time = parsed;
          roomData.end_time = new Date(parsed.getTime() + 60 * 60 * 1000);
        }
      }

      // Cập nhật room
      const updatedRoom = await this.meetingRoomRepo.update(id, roomData);
      
      // Cập nhật details nếu có
      if (details !== null) {
        // Tìm detail hiện tại
        const existingDetail = await this.meetingRoomDetailRepo.findByRoomId(id);
        
        if (existingDetail.length > 0) {
          // Normalize meeting_link to store only code
          let storedMeetingLink = details.meeting_link;
          if (details.meeting_link) {
            try {
              const url = new URL(details.meeting_link);
              const parts = url.pathname.split('/').filter(Boolean);
              storedMeetingLink = parts.length > 0 ? parts[parts.length - 1] : details.meeting_link;
            } catch (e) {
              // keep as-is
              storedMeetingLink = details.meeting_link;
            }
          }

          // Cập nhật detail hiện tại
          await this.meetingRoomDetailRepo.update(existingDetail[0].id, {
            meeting_link: storedMeetingLink,
            meeting_password: details.meeting_password || null,
            notes: details.notes || null,
            recorded_url: details.recorded_url || null
          });
        } else {
          // Tạo detail mới (normalize meeting_link similarly)
          let storedMeetingLink = details.meeting_link;
          if (details.meeting_link) {
            try {
              const url = new URL(details.meeting_link);
              const parts = url.pathname.split('/').filter(Boolean);
              storedMeetingLink = parts.length > 0 ? parts[parts.length - 1] : details.meeting_link;
            } catch (e) {
              storedMeetingLink = details.meeting_link;
            }
          }

          await this.meetingRoomDetailRepo.create({
            room_id: id,
            meeting_link: storedMeetingLink,
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

    // Nếu chuyển sang 'ongoing', đặt actual_start_time (và start_time nếu còn null)
    if (status === 'ongoing' && (room.status === 'scheduled' || room.status === null)) {
      const transaction = await sequelize.transaction();
      try {
        const now = new Date();
        // Nếu start_time chưa set, đặt start_time = now
        const updateData = { actual_start_time: now };
        if (!room.start_time) {
          updateData.start_time = now;
        }

        // Đặt end_time = base + 1 giờ (nếu actual_start_time tồn tại thì ưu tiên)
        const baseForEnd = updateData.actual_start_time || updateData.start_time || room.start_time || now;
        if (baseForEnd) {
          updateData.end_time = new Date(new Date(baseForEnd).getTime() + 60 * 60 * 1000);
        }

        const updatedRoom = await this.meetingRoomRepo.updateStatus(id, status, updateData);
        await transaction.commit();
        return updatedRoom;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
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

  // Find meeting id by meeting_link (full link or code segment)
  async findMeetingIdByLink(meetingLink) {
    // If the client passed a full URL, try to extract the last path segment as code
    let code = meetingLink;
    try {
      const url = new URL(meetingLink);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 0) code = parts[parts.length - 1];
    } catch (e) {
      // Not a full URL, keep meetingLink as-is
      code = meetingLink;
    }

    // First try exact match on meeting_link, then try code suffix
    const detail = await this.meetingRoomDetailRepo.findByMeetingLinkCode(code);
    if (!detail) return null;

    return { meeting_id: detail.room_id };
  }
}

module.exports = MeetingRoomService;