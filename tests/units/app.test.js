// tests/unit/health.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

// Get the version and author from our package.json

describe('/ health check', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(404);
  });
});
