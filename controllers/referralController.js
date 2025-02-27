const { User, Referral, Reward } = require('../models');
const { sequelize } = require('../config/database');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get users referred by the logged-in user
// @route   GET /api/referrals
// @access  Private
exports.getReferrals = async (req, res, next) => {
    try {
        const referrals = await User.findAll({
            where: { referredBy: req.user.id },
            attributes: ['id', 'username', 'email', 'createdAt']
        });

        res.status(200).json({
            success: true,
            count: referrals.length,
            data: referrals
        });
    } catch (error) {
        next(new ErrorResponse('Error fetching referrals', 500));
    }
};

// @desc    Get referral stats for the logged-in user
// @route   GET /api/referral-stats
// @access  Private
exports.getReferralStats = async (req, res, next) => {
    try {
        const referralCount = await User.count({
            where: { referredBy: req.user.id }
        });

        if (!req.user.referralCode) {
            return next(new ErrorResponse('No referral code found for user', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                totalReferrals: referralCount,
                referralCode: req.user.referralCode
            }
        });
    } catch (error) {
        next(new ErrorResponse('Error fetching referral stats', 500));
    }
};

// @desc    Generate referral link for the logged-in user
// @route   GET /api/generate-referral-link
// @access  Private
exports.generateReferralLink = async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const referralLink = `${baseUrl}/register?ref=${req.user.referralCode}`;
    
    res.status(200).json({
      success: true,
      referralLink
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};