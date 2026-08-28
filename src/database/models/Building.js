const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Building = sequelize.define(
  'Building',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'buildings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Building;