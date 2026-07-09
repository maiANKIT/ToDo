import api from "./api";

const BASE = "/api/v1/workspace";

export const createWorkspace = (data) => api.post(BASE, data);

export const getWorkspaces = () => api.get(BASE);

export const getWorkspaceById = (id) => api.get(`${BASE}/${id}`);

export const updateWorkspace = (id, data) => api.put(`${BASE}/${id}`, data);

export const archiveWorkspace = (id) => api.patch(`${BASE}/${id}/archive`);

export const restoreWorkspace = (id) => api.patch(`${BASE}/${id}/restore`);

export const inviteMember = (id, data) => api.post(`${BASE}/${id}/invite`, data);

export const getInvitationByToken = (token) => api.get(`${BASE}/invite/${token}`);

export const getMyInvitations = () => api.get(`${BASE}/invitations/mine`);

export const acceptInvitation = (token) =>
  api.post(`${BASE}/invite/${token}/accept`);

export const rejectInvitation = (token) =>
  api.post(`${BASE}/invite/${token}/reject`);

export const getWorkspaceInvitations = (id) =>
  api.get(`${BASE}/${id}/invitations`);

export const getWorkspaceMembers = (id) => api.get(`${BASE}/${id}/members`);

export const changeMemberRole = (workspaceId, memberId, role) =>
  api.patch(`${BASE}/${workspaceId}/member/${memberId}/role`, { role });

export const removeMember = (workspaceId, memberId) =>
  api.delete(`${BASE}/${workspaceId}/member/${memberId}`);

export const leaveWorkspace = (workspaceId) =>
  api.delete(`${BASE}/${workspaceId}/leave`);