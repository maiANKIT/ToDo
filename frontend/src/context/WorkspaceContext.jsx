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

  // ── Lightweight per-workspace preview for the sidebar (avatar stack + count),
  //    so we don't need to fetch full member lists there. ──
  const [workspacePreviews, setWorkspacePreviews] = useState({});

  // ── Pending invitations addressed to me, across all workspaces ──
  const [myInvitations, setMyInvitations] = useState([]);

  const loadWorkspacePreviews = useCallback(async (list) => {
    if (!list.length) {
      setWorkspacePreviews({});
      return;
    }
    const entries = await Promise.all(
      list.map(async (ws) => {
        try {
          const res = await getWorkspaceMembers(ws._id);
          const list = res.data.data || [];
          return [
            ws._id,
            {
              count: list.length,
              initials: list.slice(0, 3).map((m) => m.user?.name?.[0]?.toUpperCase() || "?"),
            },
          ];
        } catch (e) {
          return [ws._id, { count: 0, initials: [] }];
        }
      })
    );
    setWorkspacePreviews(Object.fromEntries(entries));
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getWorkspaces();
      const list = res.data.data || [];
      setWorkspaces(list);
      loadWorkspacePreviews(list);
    } catch (e) {
      console.log(e);
    }
  }, [user, loadWorkspacePreviews]);

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
    if (workspaces.length) loadWorkspacePreviews(workspaces);
  }, [activeWorkspace, loadMembers, workspaces, loadWorkspacePreviews]);

  useEffect(() => {
    if (user) {
      refreshWorkspaces();
      refreshMyInvitations();
    } else {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
      setMembers([]);
      setMyInvitations([]);
      setWorkspacePreviews({});
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
        workspacePreviews,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};