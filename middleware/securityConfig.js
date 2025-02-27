const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    }
});

// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        success: false,
        message: 'Too many registration attempts, please try again after an hour'
    }
});

const configSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // Prevent XSS attacks
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp());

    // Rate limiters
    app.use('/api/auth/login', loginLimiter);
    app.use('/api/auth/register', registerLimiter);

    // Cookie parser
    app.use(cookieParser());

    // CSRF protection
    app.use(csrf({ cookie: true }));

    // CORS configuration
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
};

module.exports = {
    configSecurity,
    loginLimiter,
    registerLimiter
};