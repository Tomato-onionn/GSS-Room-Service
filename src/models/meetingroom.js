const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Meetingroom', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('scheduled','ongoing','completed','canceled'),
      allowNull: true,
      defaultValue: "scheduled"
    },
    actual_start_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Thời điểm thực tế bắt đầu meeting (khi chuyển sang ongoing)"
    }
  }, {
    sequelize,
    tableName: 'meetingroom',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
