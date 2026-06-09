import api from "./api";

export const signupUser = async (data) => {
  return await api.post("/api/v1/user/signup", data);
};

export const loginUser = async (data) => {
  return await api.post("/api/v1/user/login", data);
};