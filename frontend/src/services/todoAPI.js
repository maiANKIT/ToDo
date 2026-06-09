import api from "./api";

export const getTodos = async () => {
  return await api.get("/todo");
};

export const createTodo = async (data) => {
  return await api.post("/todo/create", data);
};

export const updateTodo = async (id, data) => {
  return await api.put(`/todo/${id}`, data);
};

export const deleteTodo = async (id) => {
  return await api.delete(`/todo/${id}`);
};