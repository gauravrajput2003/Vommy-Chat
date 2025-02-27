const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email utility function
exports.sendEmail = async (options) => {
    const message = {
        from: `Vommy Chat <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Email could not be sent');
    }
};

// Password reset email template
exports.sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const message = {
        email,
        subject: 'Password Reset Request',
        html: `
            <h1>You have requested a password reset</h1>
            <p>Please click on the following link to reset your password:</p>
            <a href="${resetUrl}" target="_blank">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 10 minutes.</p>
        `
    };

    await exports.sendEmail(message);
};

// Welcome email template
exports.sendWelcomeEmail = async (email, username) => {
    const message = {
        email,
        subject: 'Welcome to Vommy Chat!',
        html: `
            <h1>Welcome ${username}!</h1>
            <p>Thank you for joining Vommy Chat.</p>
            <p>We're excited to have you on board!</p>
        `
    };

    await exports.sendEmail(message);
};

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: `Vommy Chat <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;