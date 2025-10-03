var DataTypes = require("sequelize").DataTypes;
var _Meetinghistory = require("./meetinghistory");
var _Meetingroom = require("./meetingroom");
var _Meetingroomdetail = require("./meetingroomdetail");
var _RoomParticipants = require("./room_participants");

function initModels(sequelize) {
  var Meetinghistory = _Meetinghistory(sequelize, DataTypes);
  var Meetingroom = _Meetingroom(sequelize, DataTypes);
  var Meetingroomdetail = _Meetingroomdetail(sequelize, DataTypes);
  var RoomParticipants = _RoomParticipants(sequelize, DataTypes);

  Meetinghistory.belongsTo(Meetingroom, { as: "room", foreignKey: "room_id"});
  Meetingroom.hasMany(Meetinghistory, { as: "meetinghistories", foreignKey: "room_id"});
  Meetingroomdetail.belongsTo(Meetingroom, { as: "room", foreignKey: "room_id"});
  Meetingroom.hasMany(Meetingroomdetail, { as: "meetingroomdetails", foreignKey: "room_id"});
  RoomParticipants.belongsTo(Meetingroom, { as: "room", foreignKey: "room_id"});
  Meetingroom.hasMany(RoomParticipants, { as: "room_participants", foreignKey: "room_id"});

  return {
    Meetinghistory,
    Meetingroom,
    Meetingroomdetail,
    RoomParticipants,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
