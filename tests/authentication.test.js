const request = require('supertest');

const app = require('../src/app');

describe('Authentication', () => {
  test('returns 401 when accessing a protected resource without token', async () => {
    const response = await request(app)
      .get('/buildings');

    expect(response.statusCode).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required'
      }
    });
  });
});