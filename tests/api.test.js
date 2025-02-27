const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const bcrypt = require('bcrypt');

describe('API Endpoints', () => {
    let token;
    let testUser;

    beforeEach(async () => {
        // Create test user
        testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            referralCode: 'TEST123'
        });

        // Login
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        
        token = response.body.token;
    });

    describe('GET /api/referrals/stats', () => {
        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/referrals/stats');

            expect(res.statusCode).toBe(401);
        });

        it('should return referral stats', async () => {
            const res = await request(app)
                .get('/api/referrals/stats')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('totalReferrals');
            expect(res.body.data).toHaveProperty('referralCode');
        });

        it('should handle invalid token', async () => {
            const res = await request(app)
                .get('/api/referrals/stats')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.statusCode).toBe(401);
        });
    });
});