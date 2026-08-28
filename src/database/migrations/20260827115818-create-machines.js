'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('machines', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      building_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buildings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      serial_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      status: {
        type: Sequelize.ENUM(
          'ONLINE',
          'OFFLINE',
          'OUT_OF_SERVICE',
          'ERROR',
          'MAINTENANCE',
          'DISABLED'
        ),
        allowNull: false,
        defaultValue: 'OFFLINE'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('machines');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_machines_status";'
    );
  }
};