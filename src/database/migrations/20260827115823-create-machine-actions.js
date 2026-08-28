'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('machine_actions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      machine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'machines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      requested_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      action_type: {
        type: Sequelize.ENUM(
          'RESTART',
          'ENABLE',
          'DISABLE',
          'SET_MAINTENANCE'
        ),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'IN_PROGRESS',
          'SUCCEEDED',
          'FAILED'
        ),
        allowNull: false,
        defaultValue: 'PENDING'
      },

      requested_at: {
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
    await queryInterface.dropTable('machine_actions');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_machine_actions_action_type";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_machine_actions_status";'
    );
  }
};