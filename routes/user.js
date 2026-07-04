const express = require('express');

const router = express.Router();

const {signup, verifyOTP, resendOTP, login} =require('../controller/auth');

router.post('/signup', signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post('/login', login);

module.exports = router;