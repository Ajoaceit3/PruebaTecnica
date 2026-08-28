'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('machines', [
      {
        id: 1,
        building_id: 1,
        name: 'Coffee Machine A1',
        serial_number: 'VM-A-001',
        status: 'ONLINE',
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        building_id: 1,
        name: 'Snack Machine A2',
        serial_number: 'VM-A-002',
        status: 'OFFLINE',
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        building_id: 2,
        name: 'Coffee Machine B1',
        serial_number: 'VM-B-001',
        status: 'ONLINE',
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        building_id: 2,
        name: 'Snack Machine B2',
        serial_number: 'VM-B-002',
        status: 'ERROR',
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        building_id: 3,
        name: 'Coffee Machine C1',
        serial_number: 'VM-C-001',
        status: 'MAINTENANCE',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('machines', 'id'),
        (SELECT MAX(id) FROM machines)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('machines', {
      id: [1, 2, 3, 4, 5],
    });
  },
};