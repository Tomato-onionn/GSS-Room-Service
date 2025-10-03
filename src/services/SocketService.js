const { Server } = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // roomId -> Set of socket connections
    this.userRooms = new Map(); // socketId -> roomId
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('🔌 Socket.IO initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Join room
      socket.on('join-room', (data) => {
        this.handleJoinRoom(socket, data);
      });

      // Leave room
      socket.on('leave-room', (data) => {
        this.handleLeaveRoom(socket, data);
      });

      // Chat message (commented out to avoid duplicates - use send-message instead)
      // socket.on('chat-message', (data) => {
      //   this.handleChatMessage(socket, data);
      // });

      // Handle send-message event (NEW project pattern - primary)
      socket.on('send-message', (data) => {
        this.handleSendMessage(socket, data);
      });

      // Video/Audio status updates
      socket.on('media-status-update', (data) => {
        this.handleMediaStatusUpdate(socket, data);
      });

      // Screen sharing status
      socket.on('screen-sharing-update', (data) => {
        this.handleScreenSharingUpdate(socket, data);
      });

      // User status update (joined/left video call)
      socket.on('user-status-update', (data) => {
        this.handleUserStatusUpdate(socket, data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  handleJoinRoom(socket, data) {
    const { roomId, userName, userId } = data;
    
    try {
      // Leave previous room if any
      this.leaveAllRooms(socket);

      // Join new room
      socket.join(roomId);
      this.userRooms.set(socket.id, roomId);

      // Track user in room
      if (!this.connectedUsers.has(roomId)) {
        this.connectedUsers.set(roomId, new Set());
      }
      
      this.connectedUsers.get(roomId).add({
        socketId: socket.id,
        userName,
        userId,
        joinedAt: new Date(),
        isCameraOn: false,
        isMicOn: false,
        isScreenSharing: false
      });

      // Notify others in room
      socket.to(roomId).emit('user-joined', {
        socketId: socket.id,
        userName,
        displayName: userName,
        userId,
        joinedAt: new Date()
      });

      // Send current participants to new user
      const participants = Array.from(this.connectedUsers.get(roomId) || []);
      socket.emit('room-participants', participants);

      console.log(`👤 ${userName} (${userId}) joined room ${roomId}`);
      console.log(`🏠 Room ${roomId} now has ${participants.length} participants`);
      console.log(`📋 Participants in room ${roomId}:`, participants.map(p => `${p.userName}(${p.socketId})`));
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  handleLeaveRoom(socket, data) {
    const { roomId } = data;
    
    try {
      socket.leave(roomId);
      
      // Remove user from tracking
      if (this.connectedUsers.has(roomId)) {
        const roomUsers = this.connectedUsers.get(roomId);
        const userToRemove = Array.from(roomUsers).find(user => user.socketId === socket.id);
        
        if (userToRemove) {
          roomUsers.delete(userToRemove);
          
          // Notify others in room
          socket.to(roomId).emit('user-left', {
            socketId: socket.id,
            userName: userToRemove.userName,
            displayName: userToRemove.userName,
            userId: userToRemove.userId
          });

          console.log(`👤 ${userToRemove.userName} left room ${roomId}`);
        }

        // Clean up empty room
        if (roomUsers.size === 0) {
          this.connectedUsers.delete(roomId);
        }
      }

      this.userRooms.delete(socket.id);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }

  handleSendMessage(socket, data) {
    const { roomId, message, displayName, userId } = data;
    
    try {
      // Get current room participants for debugging
      const roomParticipants = this.getRoomParticipants(roomId);
      console.log(`💬 Processing send-message in room ${roomId}:`);
      console.log(`   From: ${displayName} (${socket.id})`);
      console.log(`   Message: ${message}`);
      console.log(`   Room participants: ${roomParticipants.length}`);
      console.log(`   Participant details:`, roomParticipants.map(p => `${p.userName}(${p.socketId})`));

      // Broadcast to others in room (excluding sender, like in NEW project)
      socket.to(roomId).emit('receive-message', {
        message,
        displayName,
        userId,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Message broadcasted to room ${roomId} participants (excluding sender)`);
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  }

  handleChatMessage(socket, data) {
    const { roomId, message, userName, userId } = data;
    
    try {
      // Get current room participants for debugging
      const roomParticipants = this.getRoomParticipants(roomId);
      console.log(`💬 Processing chat-message in room ${roomId}:`);
      console.log(`   From: ${userName} (${socket.id})`);
      console.log(`   Message: ${message}`);
      console.log(`   Room participants: ${roomParticipants.length}`);
      console.log(`   Participant details:`, roomParticipants.map(p => `${p.userName}(${p.socketId})`));

      const chatMessage = {
        id: Date.now().toString(),
        message,
        userName,
        userId,
        timestamp: new Date().toISOString(),
        socketId: socket.id
      };

      // Broadcast to others in room (not including sender like in NEW project)
      socket.to(roomId).emit('receive-message', {
        message,
        displayName: userName,
        userId,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Message broadcasted to room ${roomId} participants (excluding sender)`);
    } catch (error) {
      console.error('Error handling chat message:', error);
    }
  }

  handleMediaStatusUpdate(socket, data) {
    const { roomId, isCameraOn, isMicOn, userId } = data;
    
    try {
      // Update user status in tracking
      if (this.connectedUsers.has(roomId)) {
        const roomUsers = this.connectedUsers.get(roomId);
        const user = Array.from(roomUsers).find(user => user.socketId === socket.id);
        
        if (user) {
          user.isCameraOn = isCameraOn;
          user.isMicOn = isMicOn;
        }
      }

      // Broadcast to others in room
      socket.to(roomId).emit('user-media-status-update', {
        socketId: socket.id,
        userId,
        isCameraOn,
        isMicOn
      });
    } catch (error) {
      console.error('Error handling media status update:', error);
    }
  }

  handleScreenSharingUpdate(socket, data) {
    const { roomId, isScreenSharing, userId } = data;
    
    try {
      // Update user status in tracking
      if (this.connectedUsers.has(roomId)) {
        const roomUsers = this.connectedUsers.get(roomId);
        const user = Array.from(roomUsers).find(user => user.socketId === socket.id);
        
        if (user) {
          user.isScreenSharing = isScreenSharing;
        }
      }

      // Broadcast to others in room
      socket.to(roomId).emit('user-screen-sharing-update', {
        socketId: socket.id,
        userId,
        isScreenSharing
      });
    } catch (error) {
      console.error('Error handling screen sharing update:', error);
    }
  }

  handleUserStatusUpdate(socket, data) {
    const { roomId, status, userId } = data;
    
    try {
      // Broadcast to others in room
      socket.to(roomId).emit('user-status-update', {
        socketId: socket.id,
        userId,
        status
      });
    } catch (error) {
      console.error('Error handling user status update:', error);
    }
  }

  handleDisconnect(socket) {
    console.log(`👤 User disconnected: ${socket.id}`);
    
    // Find and leave all rooms
    const roomId = this.userRooms.get(socket.id);
    if (roomId) {
      this.handleLeaveRoom(socket, { roomId });
    }
  }

  leaveAllRooms(socket) {
    const currentRoom = this.userRooms.get(socket.id);
    if (currentRoom) {
      this.handleLeaveRoom(socket, { roomId: currentRoom });
    }
  }

  // Utility methods for external use
  getRoomParticipants(roomId) {
    const participants = this.connectedUsers.get(roomId);
    return participants ? Array.from(participants) : [];
  }

  sendToRoom(roomId, event, data) {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    }
  }

  sendToUser(socketId, event, data) {
    if (this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Debug method to get all room statuses
  getAllRooms() {
    const rooms = {};
    this.connectedUsers.forEach((participants, roomId) => {
      rooms[roomId] = {
        participantCount: participants.size,
        participants: Array.from(participants).map(p => ({
          socketId: p.socketId,
          userName: p.userName,
          userId: p.userId,
          joinedAt: p.joinedAt
        }))
      };
    });
    return rooms;
  }
}

module.exports = new SocketService();