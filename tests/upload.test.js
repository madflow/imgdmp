const path = require('path');
const moment = require('moment');
const TEST_DATA_PATH = path.join(__dirname, 'testdata');
process.env.DATA_PATH = TEST_DATA_PATH;
const request = require('supertest');
const rimraf = require('rimraf');
const app = require('../src/app');

describe('Upload page', () => {
  afterEach(async () => {
    await rimraf(TEST_DATA_PATH + '/images/*', () => {});
  });

  afterAll(async () => {
    await rimraf(TEST_DATA_PATH + '/*.db', () => {});
  });

  test('returns 404 with a POST request', async () => {
    const response = await request(app).get('/upload');
    expect(response.statusCode).toBe(404);
  });

  test('returns 401 with a POST request and no Bearer token', async () => {
    const response = await request(app).post('/upload');
    expect(response.statusCode).toBe(401);
  });

  test('returns 400 with a POST request and no image', async () => {
    const bearerToken = 'tester';
    process.env.BEARER_TOKEN = bearerToken;
    const response = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('returns 201 with a POST request and an image', async () => {
    const bearerToken = 'tester';
    process.env.BEARER_TOKEN = bearerToken;
    const response = await request(app)
      .post('/upload')
      .attach('image', path.join(__dirname, 'assets', 'poo.png'))
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.statusCode).toBe(201);
    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8',
    );
    expect(response.body.originalName).toBe('poo.png');
    expect(response.body.mimetype).toBe('image/png');
    expect(response.body.fileName).toContain('.png');
    expect(response.body.expires).toBe(null);
  });

  test('accepts an expiry date or expiry countdown', async () => {
    const bearerToken = 'tester';
    process.env.BEARER_TOKEN = bearerToken;

    const now = moment(new Date()).format();
    const response = await request(app)
      .post('/upload')
      .field('expires', now)
      .attach('image', path.join(__dirname, 'assets', 'poo.png'))
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(moment(response.body.expires).format()).toBe(now);
  });
});
