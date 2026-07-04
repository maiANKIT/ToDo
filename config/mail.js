const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({

    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for 587

    // Render's network doesn't support outbound IPv6, and Gmail's SMTP
    // hostname resolves to an IPv6 address first — forcing IPv4 here
    // avoids the ENETUNREACH connection failure.
    family: 4,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },

    // Fail fast instead of hanging for minutes if the connection
    // is blocked/throttled by the host provider's network.
    connectionTimeout: 10000, // 10s to establish connection
    greetingTimeout: 10000,   // 10s to receive server greeting
    socketTimeout: 15000,     // 15s of inactivity before giving up

});

module.exports = transporter;