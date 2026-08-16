const express = require('express');

const router = express.Router();

const {signup, verifyOTP, resendOTP, login, forgotPassword, resetPassword, verifyResetOTP, logout} =require('../controller/auth');

const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post('/login', login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

router.get('/check', auth, (req, res) => {
    return res.status(200).json({success: true, message: 'Session is active'});
})

router.post('/logout', logout);

module.exports = router;