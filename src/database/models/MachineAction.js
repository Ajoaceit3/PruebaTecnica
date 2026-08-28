const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const MachineAction = sequelize.define(
  'MachineAction',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    machineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'machine_id',
    },

    requestedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'requested_by_user_id',
    },

    actionType: {
      type: DataTypes.ENUM(
        'RESTART',
        'ENABLE',
        'DISABLE',
        'SET_MAINTENANCE'
      ),
      allowNull: false,
      field: 'action_type',
    },

    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'IN_PROGRESS',
        'SUCCEEDED',
        'FAILED'
      ),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  },
  {
    tableName: 'machine_actions',
    timestamps: true,

    // La migration utiliza requested_at como fecha de creación.
    createdAt: 'requested_at',
    updatedAt: 'updated_at',
  }
);

module.exports = MachineAction;