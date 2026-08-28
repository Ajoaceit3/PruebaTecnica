const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UserBuildingPermission = sequelize.define(
  'UserBuildingPermission',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },

    buildingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'building_id',
    },

    canRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'can_read',
    },

    canControl: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'can_control',
    },
  },
  {
    tableName: 'user_building_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = UserBuildingPermission;