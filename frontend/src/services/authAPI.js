import api from "./api";

export const signupUser = async (data) => {
  return await api.post("/user/signup", data);
};

export const loginUser = async (data) => {
  return await api.post("/user/login", data);
};