'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('user_building_permissions', [
      {
        id: 1,
        user_id: 1,
        building_id: 1,
        can_read: true,
        can_control: false,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        user_id: 1,
        building_id: 2,
        can_read: true,
        can_control: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        user_id: 2,
        building_id: 1,
        can_read: true,
        can_control: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        user_id: 2,
        building_id: 3,
        can_read: true,
        can_control: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('user_building_permissions', 'id'),
        (SELECT MAX(id) FROM user_building_permissions)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_building_permissions', {
      id: [1, 2, 3, 4],
    });
  },
};