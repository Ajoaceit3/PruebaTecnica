const request = require('supertest');

const app = require('../src/app');

const {
  Machine
} = require('../src/database/models');

const {
  createToken
} = require('./helpers/token');

describe('Machines', () => {
  const aliceToken = createToken(1);

  beforeEach(async () => {
    await Machine.update(
      {
        status: 'ONLINE'
      },
      {
        where: {
          id: 3
        }
      }
    );
  });

  test('allows a user with read permission to retrieve a machine', async () => {
    const response = await request(app)
      .get('/machines/1')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.data.id).toBe(1);
    expect(response.body.data.buildingId).toBe(1);
  });

  test('returns 404 when the machine belongs to an inaccessible building', async () => {
    const response = await request(app)
      .get('/machines/5')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      );

    expect(response.statusCode).toBe(404);

    expect(response.body.error.code)
      .toBe('MACHINE_NOT_FOUND');
  });

  test('does not allow status updates with read-only permission', async () => {
    const response = await request(app)
      .patch('/machines/1/status')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      )
      .send({
        status: 'MAINTENANCE'
      });

    expect(response.statusCode).toBe(403);

    expect(response.body.error.code)
      .toBe('CONTROL_PERMISSION_REQUIRED');
  });

  test('allows status updates with control permission and persists the change', async () => {
    const response = await request(app)
      .patch('/machines/3/status')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      )
      .send({
        status: 'MAINTENANCE'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.status)
      .toBe('MAINTENANCE');

    const storedMachine =
      await Machine.findByPk(3);

    expect(storedMachine.status)
      .toBe('MAINTENANCE');
  });

  test('returns 400 when the machine status is invalid', async () => {
    const response = await request(app)
      .patch('/machines/3/status')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      )
      .send({
        status: 'BROKEN'
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.error.code)
      .toBe('VALIDATION_ERROR');
  });
});