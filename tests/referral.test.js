const request = require('supertest');
const app = require('../server');
const User = require('../models');
const Referral = require('../models/Referral');

describe('Referral System', () => {
  let referrerToken;
  let referralCode;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Referral.destroy({ where: {} });

    // Create referrer
    const referrer = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'referrer',
        email: 'referrer@example.com',
        password: 'password123'
      });

    referrerToken = referrer.body.token;
    referralCode = referrer.body.referralCode;
  });

  describe('Referral Registration', () => {
    it('should register with valid referral code', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'referred',
          email: 'referred@example.com',
          password: 'password123',
          referralCode
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.referredBy).toBeTruthy();
    });

    it('should reject invalid referral code', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'referred',
          email: 'referred@example.com',
          password: 'password123',
          referralCode: 'INVALID'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Invalid referral code');
    });

    it('should prevent self-referral', async () => {
      const user = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'user',
          email: 'user@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'another',
          email: 'another@example.com',
          password: 'password123',
          referralCode: user.body.referralCode
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Cannot refer yourself');
    });
  });
});