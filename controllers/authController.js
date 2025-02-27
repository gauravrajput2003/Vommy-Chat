const { User } = require('../models');
const Referral = require('../models/Referral');
const crypto = require('crypto');
const { Op } = require('sequelize');
const tokenUtils = require('../utils/tokenUtils');
const sendEmail = require('../utils/emailUtils');
const Reward = require('../models/Reward');
const jwt = require('jsonwebtoken');

const createReferralReward = async (referrerId) => {
    await Reward.create({
        userId: referrerId,
        type: 'REFERRAL',
        points: 10,
        status: 'PENDING'
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set secure cookie options
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
};

// @desc    Register user
// @route   POST /api/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password, referralCode } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            referralCode: crypto.randomBytes(3).toString('hex').toUpperCase(),
            referredBy: referralCode ? (await User.findOne({ where: { referralCode } }))?.id : null
        });

        // Handle referral
        if (req.referrer) {
            await Referral.create({
                referrerId: req.referrer.id,
                referredUserId: user.id,
                status: 'successful'
            });
            await createReferralReward(req.referrer.id);
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                referralCode: user.referralCode
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};

// @desc    Forgot password
// @route   POST /api/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user with that email'
            });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
        const message = `Password reset token: \n\n ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({
            success: true,
            message: 'Email sent'
        });

    } catch (error) {
        console.error(error);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        res.status(500).json({
            success: false,
            message: 'Email could not be sent'
        });
    }
};