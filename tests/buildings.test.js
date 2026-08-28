const request = require('supertest');

const app = require('../src/app');
const { createToken } = require('./helpers/token');

describe('Buildings', () => {
  const aliceToken = createToken(1);

  test('returns only the buildings accessible to the authenticated user', async () => {
    const response = await request(app)
      .get('/buildings')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      );

    expect(response.statusCode).toBe(200);

    const buildingIds =
      response.body.data.map(
        (building) => building.id
      );

    expect(buildingIds).toEqual([1, 2]);

    expect(
      response.body.data[0].permissions
    ).toEqual({
      read: true,
      control: false
    });

    expect(
      response.body.data[1].permissions
    ).toEqual({
      read: true,
      control: true
    });
  });

  test('returns 404 when the user cannot access the requested building', async () => {
    const response = await request(app)
      .get('/buildings/3')
      .set(
        'Authorization',
        `Bearer ${aliceToken}`
      );

    expect(response.statusCode).toBe(404);

    expect(response.body.error.code)
      .toBe('BUILDING_NOT_FOUND');
  });
});