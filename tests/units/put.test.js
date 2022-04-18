// tests/unit/getid.test.js

const request = require('supertest');
var path = require('path');

const app = require('../../src/app');
const logger = require('../../src/logger');
var filename;
beforeAll(async () => {
  const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('{"This": "is a test"}');

  filename = path.basename(res.headers.location);

  logger.debug({ filename }, ' Fragment Id');
});

describe('PUT /v1/fragments/${filename}', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).put(`/v1/fragments/${filename}`).expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .put(`/v1/fragments/${filename}`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users can PUT a Fragment', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${filename}`)
      .set({ 'Content-Type': 'text/plain' })
      .send('THIS IS PUT')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(201);
  });

  test('authenticated users cannot finda Fragment', async () => {
    const res = await request(app)
      .put(`/v1/fragments/notafragment`)
      .set({ 'Content-Type': 'text/plain' })
      .send('THIS IS PUT')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated users PUT MUST HAVE A BODY AND TYPE ', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${filename}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
  });

  test('authenticated users BOdy is not a buffer ', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${filename}`)
      .send('THIS IS PUT')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
});
