'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feedbacks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      module_type: {
        type: Sequelize.ENUM(
          'meeting_room',      // Feedback cho phòng họp
          'mentor',            // Feedback cho mentor
          'user',              // Feedback cho user
          'course',            // Feedback cho khóa học
          'system',            // Feedback cho hệ thống
          'chatbot',           // Feedback cho chatbot AI
          'other'              // Loại khác
        ),
        allowNull: false,
        comment: 'Loại module nhận feedback'
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID của module (meeting_room_id, mentor_id, user_id, ...)'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID người gửi feedback'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        },
        comment: 'Đánh giá từ 1-5 sao'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Nội dung feedback chi tiết'
      },
      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'resolved', 'archived'),
        defaultValue: 'pending',
        allowNull: false,
        comment: 'Trạng thái xử lý feedback'
      },
      admin_response: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Phản hồi từ admin/quản trị viên'
      },
      responded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID admin đã phản hồi'
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Thời gian phản hồi'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Tạo indexes để tối ưu query
    await queryInterface.addIndex('feedbacks', ['module_type', 'module_id'], {
      name: 'idx_feedbacks_module'
    });
    
    await queryInterface.addIndex('feedbacks', ['user_id'], {
      name: 'idx_feedbacks_user'
    });
    
    await queryInterface.addIndex('feedbacks', ['status'], {
      name: 'idx_feedbacks_status'
    });

    await queryInterface.addIndex('feedbacks', ['rating'], {
      name: 'idx_feedbacks_rating'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('feedbacks');
  }
};
