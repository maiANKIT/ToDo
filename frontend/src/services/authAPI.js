import api from "./api";

// Confirmed from index.js: app.use("/api/v1/user", userRoutes) —
// so all auth endpoints (signup, verify-otp, resend-otp, login) live
// under /api/v1/user, even though the controller file is named auth.js.

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