const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    otp:{
        type: String,
        required: true,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    expiresAt:{
        type: Date,
        required: true,
        expires: 0
    }

},
{
    timestamps: true
}
)

module.exports = mongoose.model("ResetPassword", resetPasswordSchema);