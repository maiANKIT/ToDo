const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true,
        expires: 0,
    },
},

{
    timestamps: true,
}

);

module.exports = mongoose.model('OTP', otpSchema);