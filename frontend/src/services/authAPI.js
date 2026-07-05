import api from "./api";

// Confirmed from index.js: app.use("/api/v1/user", userRoutes) —
// all auth endpoints (signup, verify-otp, resend-otp, login,
// forgot-password, verify-reset-otp, reset-password) live under
// /api/v1/user, even though the controller file is named auth.js.

export const signupUser = async (data) => {
  return await api.post("/api/v1/user/signup", data);
};

export const verifyOTP = async (data) => {
  return await api.post("/api/v1/user/verify-otp", data);
};

export const resendOTP = async (data) => {
  return await api.post("/api/v1/user/resend-otp", data);
};

export const loginUser = async (data) => {
  return await api.post("/api/v1/user/login", data);
};

export const forgotPassword = async (data) => {
  return await api.post("/api/v1/user/forgot-password", data);
};

export const verifyResetOTP = async (data) => {
  return await api.post("/api/v1/user/verify-reset-otp", data);
};

export const resetPassword = async (data) => {
  return await api.post("/api/v1/user/reset-password", data);
};