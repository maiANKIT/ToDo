import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getWorkspaces, getWorkspaceMembers, getMyInvitations } from "../services/workspaceAPI";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // ── Pending invitations addressed to me, across all workspaces ──
  const [myInvitations, setMyInvitations] = useState([]);

  const refreshWorkspaces = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getWorkspaces();
      setWorkspaces(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }, [user]);

  const refreshMyInvitations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getMyInvitations();
      setMyInvitations(res.data.data || []);
    } catch (e) {
      setMyInvitations([]);
    }
  }, [user]);

  const loadMembers = useCallback(async (workspaceId) => {
    if (!workspaceId) {
      setMembers([]);
      return;
    }
    setMembersLoading(true);
    try {
      const res = await getWorkspaceMembers(workspaceId);
      setMembers(res.data.data || []);
    } catch (e) {
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const setActiveWorkspace = useCallback(
    (ws) => {
      setActiveWorkspaceState(ws);
      loadMembers(ws?._id);
    },
    [loadMembers]
  );

  const refreshMembers = useCallback(() => {
    loadMembers(activeWorkspace?._id);
  }, [activeWorkspace, loadMembers]);

  useEffect(() => {
    if (user) {
      refreshWorkspaces();
      refreshMyInvitations();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
      setMembers([]);
      setMyInvitations([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Agar active workspace list se hi gayab ho jaye (archive/leave), clear kar do
  useEffect(() => {
    if (activeWorkspace && workspaces.length > 0) {
      const stillExists = workspaces.some((w) => w._id === activeWorkspace._id);
      if (!stillExists) {
        setActiveWorkspaceState(null);
        setMembers([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        members,
        membersLoading,
        refreshWorkspaces,
        refreshMembers,
        myInvitations,
        refreshMyInvitations,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};