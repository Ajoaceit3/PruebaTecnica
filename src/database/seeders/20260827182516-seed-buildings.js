'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('buildings', [
      {
        id: 1,
        name: 'Building A',
        address: '10 Main Street',
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: 'Building B',
        address: '25 Business Avenue',
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: 'Building C',
        address: '8 Industrial Road',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('buildings', 'id'),
        (SELECT MAX(id) FROM buildings)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('buildings', {
      id: [1, 2, 3],
    });
  },
};