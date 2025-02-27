const { User, Referral, Reward } = require('../models');
const bcrypt = require('bcrypt');

async function setupDemoData() {
    // Create demo users
    const user1 = await User.create({
        username: 'demo.user',
        email: 'demo@example.com',
        password: await bcrypt.hash('Demo@123', 10)
    });

    const user2 = await User.create({
        username: 'referred.user',
        email: 'referred@example.com',
        password: await bcrypt.hash('Demo@123', 10),
        referredBy: user1.id
    });

    console.log('Demo data created successfully');
}

setupDemoData();