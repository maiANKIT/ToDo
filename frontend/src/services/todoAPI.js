import api from "./api";

export const getTodos = async (workspaceId) => {
  return await api.get("/api/v1/todo", {
    params: workspaceId ? { workspace: workspaceId } : {},
  });
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

export const addSubtask = async (todoId, data) => {
  return await api.post(`/api/v1/todo/${todoId}/subtask`, data);
};

export const updateSubtask = async (todoId, subtaskId, data) => {
  return await api.put(`/api/v1/todo/${todoId}/subtask/${subtaskId}`, data);
};

export const deleteSubtask = async (todoId, subtaskId) => {
  return await api.delete(`/api/v1/todo/${todoId}/subtask/${subtaskId}`);
};