// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users Can post a Fragment type application/json', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'application/json' })
      .send('This is a test');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users will receive 415 for wrong media type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
      .send('This is a test');

    expect(res.body.status).toBe('error');
    expect(res.statusCode).toBe(415);
  });

  test('authenticated users Can post a Fragment type text/*', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/*' })
      .send('This is a test');

    expect(res.statusCode).toBe(201);
  });
});
