import api from "./api";

export const getTodos = async () => {
  return await api.get("/api/v1/todo");
};

export const createTodo = async (data) => {
  return await api.post("/api/v1/todo/create", data);
};

export const updateTodo = async (id, data) => {
  return await api.put(`/api/v1/todo/${id}`, data);
};

export const deleteTodo = async (id) => {
  return await api.delete(`/api/v1/todo/${id}`);
};