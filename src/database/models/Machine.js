const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Machine = sequelize.define(
  'Machine',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'building_id',
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'serial_number',
    },

    status: {
      type: DataTypes.ENUM(
        'ONLINE',
        'OFFLINE',
        'OUT_OF_SERVICE',
        'ERROR',
        'MAINTENANCE',
        'DISABLED'
      ),
      allowNull: false,
      defaultValue: 'OFFLINE',
    },
  },
  {
    tableName: 'machines',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Machine;