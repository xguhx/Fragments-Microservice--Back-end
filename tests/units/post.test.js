// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // test('authenticated users get a fragments array', async () => {
  //   const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(Array.isArray(res.body.fragments)).toBe(true);
  // });
});
