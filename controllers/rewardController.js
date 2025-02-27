const Reward = require('../models/Reward');
const User = require('../models');

exports.claimReward = async (req, res) => {
    try {
        const reward = await Reward.findOne({
            where: {
                userId: req.user.id,
                status: 'PENDING'
            }
        });

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: 'No pending rewards found'
            });
        }

        reward.status = 'CLAIMED';
        await reward.save();

        // Update user's reward points
        await User.increment('rewardPoints', {
            by: reward.points,
            where: { id: req.user.id }
        });

        res.status(200).json({
            success: true,
            message: 'Reward claimed successfully',
            reward
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};