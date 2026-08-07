import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { WorkspaceContext } from "../context/WorkspaceContext";

// Personal mode (no active workspace) = full control over your own data.
const FULL_PERMISSIONS = {
  canView: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canAssign: true,
  canInvite: true,
  canManageMembers: true,
  canManageWorkspace: true,
  canComment: true,
};

// Fail-safe fallback while members are still loading, or if something's
// off (e.g. membership not found) — never grant destructive access by default.
const VIEW_ONLY_PERMISSIONS = {
  canView: true,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canAssign: false,
  canInvite: false,
  canManageMembers: false,
  canManageWorkspace: false,
  canComment: false,
};

/**
 * Returns the current user's effective permissions for the active scope.
 * - Personal (activeWorkspace === null): always full permissions.
 * - Workspace active: reads the logged-in user's WorkspaceMember.permissions
 *   from WorkspaceContext, matched against AuthContext's user id.
 *
 * Shape: { canView, canCreate, canEdit, canDelete, canAssign, canInvite,
 *          canManageMembers, canManageWorkspace, canComment, role, isPersonal }
 */
const useWorkspacePermissions = () => {
  const { user } = useContext(AuthContext);
  const { activeWorkspace, members, membersLoading } = useContext(WorkspaceContext);

  if (!activeWorkspace) {
    return { ...FULL_PERMISSIONS, role: "Owner", isPersonal: true };
  }

  const myMembership = members.find(
    (m) => m.user?._id === user?.id || m.user === user?.id
  );

  if (!myMembership) {
    return {
      ...VIEW_ONLY_PERMISSIONS,
      role: membersLoading ? "..." : "Viewer",
      isPersonal: false,
    };
  }

  return {
    ...myMembership.permissions,
    role: myMembership.role,
    isPersonal: false,
  };
};

export default useWorkspacePermissions;