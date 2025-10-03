const { RtcTokenBuilder, RtcRole, RtmTokenBuilder } = require('agora-token');

class AgoraConfig {
  constructor() {
    this.appId = process.env.AGORA_APP_ID || 'fa2c6947f14c43ebaa16ab0fecc756b8';
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE || '5ae251930e5748eda48183f7114c8146';
    this.tokenExpirationInSeconds = 3600; // 1 hour
    this.privilegeExpirationInSeconds = 3600; // 1 hour
    
    console.log('🔧 Agora Config initialized:', {
      appId: this.appId,
      hasCertificate: !!this.appCertificate
    });
  }

  /**
   * Generate RTC token for video/audio communication
   * @param {string} channelName - Channel name
   * @param {number} uid - User ID
   * @param {string} role - User role ('publisher' or 'subscriber')
   * @returns {string} RTC token
   */
  generateRtcToken(channelName, uid, role = 'publisher') {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + this.privilegeExpirationInSeconds;
    
    const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    return RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      rtcRole,
      privilegeExpiredTs
    );
  }

  /**
   * Generate RTM token for messaging
   * @param {string} userId - User ID for messaging
   * @returns {string} RTM token
   */
  generateRtmToken(userId) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + this.privilegeExpirationInSeconds;
    
    // RTM token simplified syntax
    return RtmTokenBuilder.buildToken(
      this.appId,
      this.appCertificate,
      userId,
      privilegeExpiredTs
    );
  }

  /**
   * Generate both RTC and RTM tokens
   * @param {string} channelName - Channel name
   * @param {number} uid - User ID
   * @param {string} role - User role
   * @returns {object} Object containing both tokens
   */
  generateTokens(channelName, uid, role = 'publisher') {
    try {
      const rtcToken = this.generateRtcToken(channelName, uid, role);
      const rtmToken = this.generateRtmToken(uid.toString());
      
      return {
        rtcToken,
        rtmToken,
        uid,
        channelName,
        appId: this.appId
      };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new Error('Failed to generate Agora tokens');
    }
  }

  /**
   * Sanitize channel name for Agora
   * @param {string} channelName - Original channel name
   * @returns {string} Sanitized channel name
   */
  sanitizeChannelName(channelName) {
    // Agora channel name must be less than 64 characters and contain only letters, digits, and underscores
    return channelName
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .substring(0, 63);
  }

  /**
   * Validate Agora configuration
   * @returns {boolean} True if configuration is valid
   */
  validateConfig() {
    if (!this.appId || !this.appCertificate) {
      console.error('Agora App ID and App Certificate are required');
      return false;
    }
    
    if (this.appId.length !== 32) {
      console.error('Invalid Agora App ID format');
      return false;
    }
    
    if (this.appCertificate.length !== 32) {
      console.error('Invalid Agora App Certificate format');
      return false;
    }
    
    return true;
  }
}

module.exports = new AgoraConfig();