const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Meetinghistory', {
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
    mentor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'meetinghistory',
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
        name: "fk_history_room",
        using: "BTREE",
        fields: [
          { name: "room_id" },
        ]
      },
    ]
  });
};
