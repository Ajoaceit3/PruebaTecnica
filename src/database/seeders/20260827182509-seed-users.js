'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('users', 'id'),
        (SELECT MAX(id) FROM users)
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      id: [1, 2],
    });
  },
};