const express = require('express');
const router = express.Router();
const cache = require('../middleware/cache');
const { protect } = require('../middleware/auth');
const { getReferrals, getReferralStats } = require('../controllers/referralController');

router.use(protect);
router.get('/stats', cache(300), getReferralStats); // Cache for 5 minutes
router.get('/', cache(60), getReferrals);  // Cache for 1 minute

module.exports = router;