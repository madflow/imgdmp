const request = require('supertest');
const app = require('../src/app');

describe('Index page', () => {
  test('returns 200 with a GET request', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('returns 404 with a POST request', async () => {
    const response = await request(app).post('/');
    expect(response.statusCode).toBe(404);
  });
});
