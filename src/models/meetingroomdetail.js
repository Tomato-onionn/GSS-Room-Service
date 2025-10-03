const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Meetingroomdetail', {
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
    meeting_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    meeting_password: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    recorded_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'meetingroomdetail',
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
        name: "fk_detail_room",
        using: "BTREE",
        fields: [
          { name: "room_id" },
        ]
      },
    ]
  });
};
