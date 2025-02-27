const { User, Referral, Reward } = require('../models');
const { connectDB } = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();

        // Create test users
        const users = await User.bulkCreate([
            {
                id: crypto.randomUUID(),
                username: 'user1',
                email: 'user1@example.com',
                password: await bcrypt.hash('password123', 10),
                referralCode: crypto.randomBytes(4).toString('hex')
            },
            {
                id: crypto.randomUUID(),
                username: 'user2',
                email: 'user2@example.com',
                password: await bcrypt.hash('password123', 10),
                referralCode: crypto.randomBytes(4).toString('hex')
            }
        ]);

        // Create referral relationships
        await Referral.create({
            referrerId: users[0].id,
            referredUserId: users[1].id,
            code: users[0].referralCode,
            status: 'successful'
        });

        // Create rewards
        await Reward.create({
            userId: users[0].id,
            points: 100,
            type: 'referral',
            status: 'pending'
        });

        console.log('Seed data created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();