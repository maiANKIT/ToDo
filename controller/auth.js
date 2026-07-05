const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");

const generateOTP = require("../utils/generateOTP");
const mailSender = require("../utils/mailSender");
const verifyEmailTemplate = require("../templates/verifyEmail");
const jwt = require("jsonwebtoken");
const forgetPasswordTemplate = require("../templates/forgetPassword");
const ResetPassword = require("../models/ResetPassword");
const resetSuccessTemplate = require("../templates/resetSuccess");
const welcomeEmailTemplate = require("../templates/welcomeEmail");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    //fetch data

    const { name, email, password } = req.body;

    //validation

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,

        message: "All fields are required.",
      });
    }

    //change mail format to small

    const formattedEmail = email.trim().toLowerCase();

    //check existing user

    const existingUser = await User.findOne({
      email: formattedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,

        message: "User already exists.",
      });
    }

    //hash password

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: "Error while hashing password.",
      });
    }

    //generate otp

    const otp = generateOTP();

    let hashedOTP;

    try {
      hashedOTP = await bcrypt.hash(otp, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: "Error while hashing OTP.",
      });
    }

    const OTP_EXPIRY_MINUTES = 5;

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OTP.findOneAndUpdate(
      {
        email: formattedEmail,
      },

      {
        name,
        email: formattedEmail,
        password: hashedPassword,
        otp: hashedOTP,
        expiresAt,
      },

      {
        upsert: true,
        new: true,
      },
    );

    await mailSender(
      formattedEmail,

      "Verify Your TodoFlow Account",

      verifyEmailTemplate(otp, name),
    );

    return res.status(200).json({
      success: true,

      message: "OTP sent successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error.",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    //format email
    const formattedEmail = email.trim().toLowerCase();

    const otpData = await OTP.findOne({
      email: formattedEmail,
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    //check otp expiry
    if (new Date() > otpData.expiresAt) {
      await OTP.deleteOne({
        email: formattedEmail,
      });

      return res.status(400).json({
        success: false,
        message: "OTP is expired Please request new OTP",
      });
    }

    //compare otp

    const isOTPValid = await bcrypt.compare(otp, otpData.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //check for existing user
    const existingUser = await User.findOne({ email: formattedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user already exist",
      });
    }

    //create user
    const user = await User.create({
      name: otpData.name,
      email: otpData.email,
      password: otpData.password,
    });

    //delete otp
    await OTP.deleteOne({
      email: formattedEmail,
    });

    //jwt payload
    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userData = user.toObject();
    userData.password = undefined;
    userData.token = token;

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    await mailSender(
        user.email,
        "Welcome TodoFlow",
        welcomeEmailTemplate(user.name)
    )

    return res.cookie("token", token, options).status(201).json({
      success: true,
      token,
      user: userData,
      message: "email verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const formattedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: formattedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const otpData = await OTP.findOne({ email: formattedEmail });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "signup request not found",
      });
    }

    //generate new otp
    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    const OTP_EXPIRY_MINUTES = 5;

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    //update otp
    await OTP.findOneAndUpdate(
      {
        email: formattedEmail,
      },
      {
        otp: hashedOTP,
        expiresAt,
      },
    );

    //send otp mail
    await mailSender(
      formattedEmail,
      "Your new OTP for ToDoFlow",
      verifyEmailTemplate(otp, otpData.name),
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent successfully  ",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch data from body
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    //format email
    const formattedEmail = email.trim().toLowerCase();

    //find user
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // jwt payload
    const payload = {
      email: user.email,
      id: user._id,
    };

    //generate jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    //user document
    const userData = user.toObject();

    userData.password = undefined;
    userData.token = token;

    //cookie options

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    //return response
    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userData,
      message: "Login successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    //fetch data
    const { email } = req.body;

    //validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //format email
    const formattedEmail = email.trim().toLowerCase();

    //user existance
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //generate otp
    const otp = generateOTP();

    //hash otp
    const hashedOTP = await bcrypt.hash(otp, 10);

    //otp expiry
    const OTP_EXPIRY_MINUTES = 5;

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    //save or update otp
    await ResetPassword.findOneAndUpdate(
      {
        email: formattedEmail,
      },
      {
        email: formattedEmail,
        otp: hashedOTP,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
      },
    );

    //send mail
    await mailSender(
      formattedEmail,
      "Reset Your ToDoFlow Password",

      forgetPasswordTemplate(otp, user.name),
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    //fetch data
    const { email, otp } = req.body;

    //validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    //email format
    const formattedEmail = email.trim().toLowerCase();

    //find otp
    const otpData = await ResetPassword.findOne({
      email: formattedEmail,
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    //check expiry
    if (new Date() > otpData.expiresAt) {
      await ResetPassword.deleteOne({ email: formattedEmail });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. request new otp",
      });
    }

    //compare otp
    const isOTPValid = await bcrypt.compare(otp, otpData.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }

    //otp verified
    await ResetPassword.findOneAndUpdate(
      {
        email: formattedEmail,
      },
      {
        isVerified: true,
      },
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "otp is verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //data from req body
    const { email, newPassword, confirmPassword } = req.body;

    //validation

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check pass match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password donot match",
      });
    }

    //format email
    const formattedEmail = email.trim().toLowerCase();

    //find reset request
    const resetData = await ResetPassword.findOne({ email: formattedEmail });

    if (!resetData) {
      return res.status(404).json({
        success: false,
        message: "reset request not found",
      });
    }

    //check otp verified
    if (!resetData.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    //find user
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,

        message: "New password cannot be the same as the old password",
      });
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //updated password
    user.password = hashedPassword;

    await user.save();

    //delete reset password document
    await ResetPassword.deleteOne({ email: formattedEmail });

    await mailSender(
    formattedEmail,
    "Password Reset Successful",
    resetSuccessTemplate(user.name)
);

    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
