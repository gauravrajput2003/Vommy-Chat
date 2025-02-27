const session = require('express-session');
const cookieParser = require('cookie-parser');

const configSession = (app) => {
    // Cookie parser
    app.use(cookieParser());

    // Session configuration
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));
};

module.exports = configSession;