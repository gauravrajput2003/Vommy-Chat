const {User} = require('../models');
const Reward = require('../models/Reward');

const trackReferral = async (req, res, next) => {
    try {
        const { referralCode } = req.body;
        if (!referralCode) return next();

        const referrer = await User.findOne({ where: { referralCode } });
        if (!referrer) {
            return res.status(400).json({
                success: false,
                message: 'Invalid referral code'
            });
        }

        req.referrer = referrer;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { trackReferral };