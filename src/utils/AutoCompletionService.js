const cron = require('node-cron');
const MeetingRoomService = require('../services/MeetingRoomService');

class AutoCompletionService {
  constructor() {
    this.meetingRoomService = new MeetingRoomService();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Auto-completion service is already running');
      return;
    }

      // Schedule: configurable via AUTO_COMPLETE_CRON env var. Default to every minute for accurate end_time handling.
      const schedule = '*/5 * * * *' ;
      this.cronJob = cron.schedule(schedule, async () => {
      try {
        console.log('🔄 Checking for meetings to auto-complete...');
        
        const completedRooms = await this.meetingRoomService.autoCompleteOngoingRooms();
        
        if (completedRooms.length > 0) {
          console.log(`✅ Auto-completed ${completedRooms.length} meeting(s):`);
          completedRooms.forEach(room => {
            console.log(`   - Room: ${room.room_name} (ID: ${room.id})`);
          });
        } else {
          console.log('ℹ️  No meetings ready for auto-completion');
        }
        
      } catch (error) {
        console.error('❌ Error in auto-completion service:', error);
      }
    });

    this.isRunning = true;
      console.log(`🚀 Auto-completion service started (schedule: ${schedule})`);
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.isRunning = false;
      console.log('⏹️  Auto-completion service stopped');
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      schedule: process.env.AUTO_COMPLETE_CRON || (process.env.NODE_ENV === 'development' ? '*/5 * * * *' : '* * * * *')
    };
  }

  // Chạy ngay lập tức (để test)
  async runNow() {
    try {
      console.log('🔄 Running auto-completion manually...');
      
      const completedRooms = await this.meetingRoomService.autoCompleteOngoingRooms();
      
      console.log(`✅ Manual run completed. Processed ${completedRooms.length} meeting(s)`);
      
      return completedRooms;
    } catch (error) {
      console.error('❌ Error in manual auto-completion:', error);
      throw error;
    }
  }
}

module.exports = AutoCompletionService;