const request = require('supertest');
const app = require('../../src/app');
const storage = require('../../src/services/storage');

describe('API integration', () => {
  beforeEach(() => {
    storage.reset();
    storage.seed();
  });

  it('lists students', async () => {
    const res = await request(app).get('/students');
    expect(res.status).toBe(200);

    expect(Array.isArray(res.body.students)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('creates student and validates uniqueness', async () => {
    const ok = await request(app).post('/students').send({ name: 'Eve', email: 'eve@example.com' });
    expect(ok.status).toBe(201);

    const ko = await request(app)
      .post('/students')
      .send({ name: 'Eve 2', email: 'eve@example.com' });
    expect(ko.status).toBe(400);
    expect(ko.body.error).toMatch(/unique/i);
  });
});
