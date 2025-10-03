const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RoomParticipants', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'meetingroom',
        key: 'id'
      }
    },
    participant_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    agora_uid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'room_participants',
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
      {
        name: "idx_room_id",
        using: "BTREE",
        fields: [
          { name: "room_id" },
        ]
      },
      {
        name: "idx_agora_uid",
        using: "BTREE",
        fields: [
          { name: "agora_uid" },
        ]
      },
      {
        name: "idx_active_participants",
        using: "BTREE",
        fields: [
          { name: "room_id" },
          { name: "is_active" },
        ]
      },
    ]
  });
};
