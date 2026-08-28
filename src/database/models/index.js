const User = require('./User');
const Building = require('./Building');
const UserBuildingPermission = require('./UserBuildingPermission');
const Machine = require('./Machine');
const MachineAction = require('./MachineAction');

// User <-> Building permissions

User.hasMany(UserBuildingPermission, {
  foreignKey: 'userId',
  as: 'buildingPermissions',
});

UserBuildingPermission.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Building.hasMany(UserBuildingPermission, {
  foreignKey: 'buildingId',
  as: 'userPermissions',
});

UserBuildingPermission.belongsTo(Building, {
  foreignKey: 'buildingId',
  as: 'building',
});


// Building -> Machines

Building.hasMany(Machine, {
  foreignKey: 'buildingId',
  as: 'machines',
});

Machine.belongsTo(Building, {
  foreignKey: 'buildingId',
  as: 'building',
});


// Machine -> Actions

Machine.hasMany(MachineAction, {
  foreignKey: 'machineId',
  as: 'actions',
});

MachineAction.belongsTo(Machine, {
  foreignKey: 'machineId',
  as: 'machine',
});


// User -> Requested actions

User.hasMany(MachineAction, {
  foreignKey: 'requestedByUserId',
  as: 'requestedActions',
});

MachineAction.belongsTo(User, {
  foreignKey: 'requestedByUserId',
  as: 'requestedBy',
});


module.exports = {
  User,
  Building,
  UserBuildingPermission,
  Machine,
  MachineAction,
};