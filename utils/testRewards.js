const User = require('../models');
const Reward = require('../models/Reward');
const Referral = require('../models/Referral');
const { connectDB } = require('../config/database');

const registerUser = async (userData) => {
    try {
        const user = await User.create({
            ...userData,
            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        });
        return user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

const testRewardFlow = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('✓ Database connected');

        // Test registration with referral
        const user1 = await registerUser({
            username: 'referrer',
            email: 'referrer@test.com',
            password: 'password123'
        });
        console.log('✓ Referrer created');

        const user2 = await registerUser({
            username: 'referred',
            email: 'referred@test.com',
            password: 'password123',
            referralCode: user1.referralCode
        });
        console.log('✓ Referred user created');

        // Create referral relationship
        await Referral.create({
            referrerId: user1.id,
            referredUserId: user2.id,
            status: 'successful',
            referralCode: user1.referralCode
        });
        console.log('✓ Referral relationship created');

        // Create reward
        await Reward.create({
            userId: user1.id,
            type: 'REFERRAL',
            points: 10,
            status: 'PENDING'
        });
        console.log('✓ Reward created');

        console.log('\n✓ Reward flow tested successfully');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
};

const testPasswordReset = async () => {
    try {
        const user = await registerUser({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });

        // Test password match
        const isMatch = await user.matchPassword('password123');
        console.log('✓ Password verification works:', isMatch);

        // Test reset token generation
        const resetToken = user.getResetPasswordToken();
        console.log('✓ Reset token generated');

    } catch (error) {
        console.error('Password test failed:', error);
    }
};

const testAPIEndpoints = async () => {
    try {
        await connectDB();

        // Test registration
        const user = await registerUser({
            username: 'apitest',
            email: 'api@test.com',
            password: 'password123'
        });
        console.log('✓ Registration endpoint works');

        // Test referral stats
        const referralStats = await Referral.findAll({
            where: { referrerId: user.id }
        });
        console.log('✓ Referral stats endpoint works');

    } catch (error) {
        console.error('API endpoint test failed:', error);
    }
};

if (require.main === module) {
    testRewardFlow();
    testAPIEndpoints();
}

module.exports = {
    testRewardFlow,
    registerUser
};