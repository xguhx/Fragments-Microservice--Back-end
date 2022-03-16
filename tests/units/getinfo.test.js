// tests/unit/getinfo.test.js

const request = require('supertest');
var path = require('path');

const app = require('../../src/app');
const logger = require('../../src/logger');
var filename;
beforeAll(async () => {
  const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'application/json' })
    .send('This is a test');

  filename = path.basename(res.headers.location);

  logger.debug({ filename }, ' Fragment Id');
});

describe('GET /v1/fragments/${filename}/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/${filename}/info`).expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get(`/v1/fragments/${filename}/info`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a Fragment', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${filename}/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });
});
