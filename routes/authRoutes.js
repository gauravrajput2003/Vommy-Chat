const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    register, 
    login, 
    forgotPassword 
} = require('../controllers/authController');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;