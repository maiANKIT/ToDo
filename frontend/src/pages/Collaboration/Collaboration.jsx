import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import Navbar from "../../components/Navbar/Navbar";
import {
  FiUsers,
  FiMail,
  FiTrash2,
  FiLogOut,
  FiArchive,
  FiX,
  FiCheck,
  FiClock,
  FiShield,
  FiList,
} from "react-icons/fi";
import {
  getWorkspaceInvitations,
  inviteMember,
  changeMemberRole,
  removeMember,
  leaveWorkspace,
  archiveWorkspace,
} from "../../services/workspaceAPI";
import "./Collaboration.css";

const ROLE_OPTIONS = ["Admin", "Editor", "Contributor", "Viewer"];

const Collaboration = () => {
  const navigate = useNavigate();

  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    members,
    membersLoading,
    refreshWorkspaces,
    refreshMembers,
  } = useContext(WorkspaceContext);

  const [invitations, setInvitations] = useState([]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviting, setInviting] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id || storedUser?._id;

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const currentMember = members.find(
    (m) => (m.user?._id || m.user) === currentUserId
  );

  const canInvite = currentMember?.permissions?.canInvite;
  const canManageMembers = currentMember?.permissions?.canManageMembers;
  const canManageWorkspace = currentMember?.permissions?.canManageWorkspace;
  const isOwner = currentMember?.role === "Owner";

  const pendingInvitations = invitations.filter((i) => i.status === "Pending");

  const fetchInvitations = async (workspaceId) => {
    try {
      const res = await getWorkspaceInvitations(workspaceId);
      setInvitations(res.data.data || []);
    } catch (e) {
      setInvitations([]);
    }
  };

  useEffect(() => {
    refreshWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeWorkspace?._id) {
      fetchInvitations(activeWorkspace._id);
    } else {
      setInvitations([]);
    }
  }, [activeWorkspace]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeWorkspace) return;

    setInviting(true);
    try {
      await inviteMember(activeWorkspace._id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });

      setInviteEmail("");
      setInviteRole("Viewer");
      setShowInviteModal(false);
      showFeedback("success", "Invitation sent");
      fetchInvitations(activeWorkspace._id);
    } catch (error) {
      showFeedback(
        "error",
        error?.response?.data?.message || "Could not send invitation"
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId, role) => {
    setActionLoadingId(memberId);
    try {
      await changeMemberRole(activeWorkspace._id, memberId, role);
      refreshMembers();
      showFeedback("success", "Role updated");
    } catch (error) {
      showFeedback(
        "error",
        error?.response?.data?.message || "Could not update role"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the workspace?")) return;

    setActionLoadingId(memberId);
    try {
      await removeMember(activeWorkspace._id, memberId);
      refreshMembers();
      showFeedback("success", "Member removed");
    } catch (error) {
      showFeedback(
        "error",
        error?.response?.data?.message || "Could not remove member"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLeaveWorkspace = async () => {
    if (!window.confirm("Leave this workspace?")) return;

    try {
      await leaveWorkspace(activeWorkspace._id);
      const remaining = workspaces.filter((w) => w._id !== activeWorkspace._id);
      setActiveWorkspace(remaining[0] || null);
      refreshWorkspaces();
      showFeedback("success", "You left the workspace");
    } catch (error) {
      showFeedback(
        "error",
        error?.response?.data?.message || "Could not leave workspace"
      );
    }
  };

  const handleArchiveWorkspace = async () => {
    if (!window.confirm("Archive this workspace?")) return;

    try {
      await archiveWorkspace(activeWorkspace._id);
      const remaining = workspaces.filter((w) => w._id !== activeWorkspace._id);
      setActiveWorkspace(remaining[0] || null);
      refreshWorkspaces();
      showFeedback("success", "Workspace archived");
    } catch (error) {
      showFeedback(
        "error",
        error?.response?.data?.message || "Could not archive workspace"
      );
    }
  };

  const handleViewTasks = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar
        searchState="closed"
        onSearchOpen={() => {}}
        onSearchClose={() => {}}
        searchTerm=""
        onSearchChange={() => {}}
        hideSearch
        overdueTasks={[]}
        withSidebar
      />

      <div className="collab-page">
        {feedback && (
          <div className={`collab-toast collab-toast-${feedback.type}`}>
            {feedback.text}
          </div>
        )}

        {!activeWorkspace ? (
          <div className="collab-empty neu-card">
            <FiUsers size={32} />
            <p>Select or create a workspace from the sidebar to start collaborating</p>
          </div>
        ) : (
          <>
            <div className="collab-hero neu-card">
              <div className="collab-hero-top">
                <span className="collab-hero-avatar">
                  {activeWorkspace.name[0]?.toUpperCase()}
                </span>
                <div>
                  <h2>{activeWorkspace.name}</h2>
                  <p className="collab-muted">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                    {activeWorkspace.description
                      ? ` · ${activeWorkspace.description}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="collab-header-actions">
                <button
                  className="collab-btn collab-btn-primary"
                  onClick={handleViewTasks}
                >
                  <FiList /> View Tasks
                </button>

                {canInvite && (
                  <button
                    className="collab-btn"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <FiMail /> Invite
                  </button>
                )}

                {canManageWorkspace && (
                  <button
                    className="collab-btn collab-btn-danger"
                    onClick={handleArchiveWorkspace}
                  >
                    <FiArchive /> Archive
                  </button>
                )}

                {currentMember && !isOwner && (
                  <button
                    className="collab-btn collab-btn-ghost"
                    onClick={handleLeaveWorkspace}
                  >
                    <FiLogOut /> Leave
                  </button>
                )}
              </div>
            </div>

            {membersLoading ? (
              <p className="collab-muted">Loading workspace details...</p>
            ) : (
              <div className="collab-sections">
                {/* Members */}
                <section className="collab-section neu-card">
                  <div className="collab-section-header">
                    <h3>
                      <FiUsers /> Members ({members.length})
                    </h3>
                  </div>

                  <div className="collab-member-list">
                    {members.map((m) => {
                      const isSelf = (m.user?._id || m.user) === currentUserId;
                      const isTargetOwner = m.role === "Owner";
                      const canEditThisRow =
                        canManageMembers && !isSelf && !isTargetOwner;

                      return (
                        <div className="collab-member-row" key={m._id}>
                          <div className="collab-member-info">
                            <div className="collab-avatar">
                              {m.user?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="collab-member-name">
                                {m.user?.name}{" "}
                                {isSelf && (
                                  <span className="collab-you-tag">you</span>
                                )}
                              </p>
                              <p className="collab-muted collab-small">
                                {m.user?.email}
                              </p>
                            </div>
                          </div>

                          <div className="collab-member-actions">
                            {canEditThisRow ? (
                              <select
                                className="collab-role-select neu-inset"
                                value={m.role}
                                disabled={actionLoadingId === m._id}
                                onChange={(e) =>
                                  handleRoleChange(m._id, e.target.value)
                                }
                              >
                                {ROLE_OPTIONS.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="collab-role-badge">
                                {m.role === "Owner" && <FiShield size={11} />}
                                {m.role}
                              </span>
                            )}

                            {canEditThisRow && (
                              <button
                                className="collab-icon-btn collab-icon-danger"
                                disabled={actionLoadingId === m._id}
                                onClick={() => handleRemoveMember(m._id)}
                                title="Remove member"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Pending invitations */}
                {canInvite && (
                  <section className="collab-section neu-card">
                    <div className="collab-section-header">
                      <h3>
                        <FiClock /> Pending Invitations ({pendingInvitations.length})
                      </h3>
                    </div>

                    <div className="collab-invite-list">
                      {pendingInvitations.length === 0 && (
                        <p className="collab-muted">No pending invitations</p>
                      )}

                      {pendingInvitations.map((inv) => (
                        <div className="collab-invite-row" key={inv._id}>
                          <div className="collab-member-info">
                            <div className="collab-avatar collab-avatar-pending">
                              {inv.email[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="collab-member-name">{inv.email}</p>
                              <p className="collab-muted collab-small">
                                Invited by {inv.invitedBy?.name || "unknown"}{" "}
                                &middot; {inv.role}
                              </p>
                            </div>
                          </div>

                          <span className="collab-status-badge collab-status-pending">
                            Pending
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <div
          className="collab-modal-overlay"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="collab-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="collab-modal-header">
              <h3>Invite Member</h3>
              <button
                className="collab-icon-btn"
                onClick={() => setShowInviteModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleInvite} className="collab-form">
              <label>Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@example.com"
                autoFocus
                required
              />

              <label>Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="collab-btn collab-btn-primary collab-btn-full"
                disabled={inviting}
              >
                {inviting ? (
                  "Sending..."
                ) : (
                  <>
                    <FiCheck /> Send Invitation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Collaboration;