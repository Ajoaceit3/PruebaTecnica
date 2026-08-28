const request = require('supertest');

const app = require('../src/app');

const {
  MachineAction
} = require('../src/database/models');

const {
  createToken
} = require('./helpers/token');

describe('Machine Actions', () => {
  const aliceToken = createToken(1);
  const bobToken = createToken(2);

  beforeEach(async () => {
    await MachineAction.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });
  });

  test('creates and persists an action when the user has control permission', async () => {
    const response = await request(app)
      .post('/machines/3/actions')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      )
      .send({
        actionType: 'RESTART'
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.data).toMatchObject({
      machineId: 3,
      requestedByUserId: 1,
      actionType: 'RESTART',
      status: 'PENDING'
    });

    const storedAction =
      await MachineAction.findByPk(
        response.body.data.id
      );

    expect(storedAction).not.toBeNull();
    expect(storedAction.machineId).toBe(3);
    expect(storedAction.requestedByUserId).toBe(1);
    expect(storedAction.status).toBe('PENDING');
  });

  test('does not expose an action to a user without access to its building', async () => {
    const created = await request(app)
      .post('/machines/3/actions')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      )
      .send({
        actionType: 'RESTART'
      });

    const actionId = created.body.data.id;

    const response = await request(app)
      .get(`/actions/${actionId}`)
      .set(
        'Authorization',
        `Bearer ${bobToken}`
      );

    expect(response.statusCode).toBe(404);

    expect(response.body.error.code)
      .toBe('ACTION_NOT_FOUND');
  });
});