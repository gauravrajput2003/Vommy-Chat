const sendEmail = require('./emailUtils');

const notifyRewardEarned = async (user, reward) => {
    const message = {
        email: user.email,
        subject: 'You earned a reward!',
        text: `Congratulations! You earned ${reward.points} points for a successful referral.`
    };

    try {
        await sendEmail(message);
    } catch (error) {
        console.error('Notification error:', error);
    }
};

module.exports = { notifyRewardEarned };