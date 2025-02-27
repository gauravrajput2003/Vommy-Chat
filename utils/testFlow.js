const { connectDB } = require('../config/database');
const User = require('../models');
const Referral = require('../models/Referral');

const testReferralFlow = async () => {
    try {
        await connectDB();
        console.log('Step 1: Checking Database Connection ✓');

        const users = await User.findAll();
        console.log(`Step 2: Verifying Users (${users.length} found) ✓`);

        const referrals = await Referral.findAll({
            include: [
                { model: User, as: 'referrer' },
                { model: User, as: 'referredUser' }
            ]
        });
        console.log(`Step 3: Verifying Referrals (${referrals.length} found) ✓`);

        console.log('\nReferral Relationships:');
        referrals.forEach(ref => {
            console.log(`${ref.referrer.username} referred ${ref.referredUser.username}`);
        });

    } catch (error) {
        console.error('Test flow failed:', error);
    }
};

testReferralFlow();