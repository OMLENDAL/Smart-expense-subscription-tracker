// This test file proves the backend route structure works with basic end-to-end checks.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');
const authService = require('../src/services/authService');
const { seedDemoAccount } = require('../src/services/demoSeedService');

process.env.JWT_SECRET = 'dev-secret-key';

jest.mock('../src/config/database', () => ({
  query: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Authentication service', () => {
  it('registers a new user successfully', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Riya', email: 'riya@example.com', created_at: new Date() }],
      });

    const result = await authService.registerUser({
      name: 'Riya',
      email: 'riya@example.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('riya@example.com');
    expect(result.token).toBeDefined();
  });

  it('logs in an existing user', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);

    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        name: 'Riya',
        email: 'riya@example.com',
        password: passwordHash,
      }],
    });

    const result = await authService.loginUser({
      email: 'riya@example.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('riya@example.com');
    expect(result.token).toBeDefined();
  });
});

describe('Local demo account seeding', () => {
  it('seeds the dashboard sample records with a hashed demo password', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 42 }] });

    await seedDemoAccount();

    const [query, params] = db.query.mock.calls[0];
    expect(query).toContain('ON CONFLICT (email) DO NOTHING');
    expect(params[0]).toBe('Demo Admin');
    expect(params[1]).toBe('admin@gmail.com');
    expect(await bcrypt.compare('admin', params[2])).toBe(true);
    expect(JSON.parse(params[3])).toHaveLength(8);
    expect(JSON.parse(params[4])).toHaveLength(5);
    expect(JSON.parse(params[5])).toHaveLength(8);
    expect(JSON.parse(params[6])).toHaveLength(3);
  });
});

describe('Expense APIs', () => {
  it('adds a new expense for the authenticated user', async () => {
    const token = jwt.sign({ id: 1, email: 'riya@example.com' }, 'dev-secret-key');

    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        user_id: 1,
        amount: 500,
        category: 'Food',
        description: 'Lunch',
        expense_date: '2026-10-06',
        payment_method: 'UPI',
        created_at: new Date(),
      }],
    });

    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', 'Bearer ' + token)
      .send({ amount: 500, category: 'Food', description: 'Lunch', expense_date: '2026-10-06', payment_method: 'UPI' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(500);
  });
});
