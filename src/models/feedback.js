const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  module_type: {
    type: DataTypes.ENUM(
      'meeting_room',
      'mentor',
      'user',
      'course',
      'system',
      'chatbot',
      'other'
    ),
    allowNull: false,
    comment: 'Loại module nhận feedback'
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID của module (meeting_room_id, mentor_id, user_id, ...)'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người gửi feedback'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Đánh giá từ 1-5 sao'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Nội dung feedback chi tiết'
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'resolved', 'archived'),
    defaultValue: 'pending',
    allowNull: false,
    comment: 'Trạng thái xử lý feedback'
  },
  admin_response: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Phản hồi từ admin/quản trị viên'
  },
  responded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID admin đã phản hồi'
  },
  responded_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian phản hồi'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'feedbacks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_feedbacks_module',
      fields: ['module_type', 'module_id']
    },
    {
      name: 'idx_feedbacks_user',
      fields: ['user_id']
    },
    {
      name: 'idx_feedbacks_status',
      fields: ['status']
    },
    {
      name: 'idx_feedbacks_rating',
      fields: ['rating']
    }
  ]
});

module.exports = Feedback;
