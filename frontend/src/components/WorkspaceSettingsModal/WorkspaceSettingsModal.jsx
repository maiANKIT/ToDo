import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import {
  X, Settings, LogOut, Archive, AlertTriangle, Info,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import {
  updateWorkspace,
  archiveWorkspace,
  leaveWorkspace,
} from "../../services/workspaceAPI";
import "./WorkspaceSettingsModal.css";

// localStorage key for the session-local "recently archived" list —
// see caveat about this being device/session scoped, not a real backend list.
const ARCHIVED_KEY = "todoflow-recently-archived";

export const rememberArchivedWorkspace = (ws) => {
  try {
    const existing = JSON.parse(localStorage.getItem(ARCHIVED_KEY) || "[]");
    const next = [
      { id: ws._id, name: ws.name, archivedAt: Date.now() },
      ...existing.filter((w) => w.id !== ws._id),
    ].slice(0, 10);
    localStorage.setItem(ARCHIVED_KEY, JSON.stringify(next));
  } catch (e) { /* noop */ }
};

const WorkspaceSettingsModal = ({ workspace, onClose }) => {
  const { user } = useContext(AuthContext);
  const { members, refreshWorkspaces, setActiveWorkspace } = useContext(WorkspaceContext);

  const myMembership = members.find((m) => m.user?._id === user?.id || m.user === user?.id);
  const myRole = myMembership?.role || "Viewer";
  const perms  = myMembership?.permissions || {};
  const isOwner = myRole === "Owner";

  const [name, setName]               = useState(workspace?.name || "");
  const [description, setDescription] = useState(workspace?.description || "");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  // Two-step confirm pattern for destructive actions (archive / leave)
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmLeave, setConfirmLeave]     = useState(false);
  const [busy, setBusy] = useState(false);

  const canManage = !!perms.canManageWorkspace;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    setSaving(true);
    setError("");
    try {
      await updateWorkspace(workspace._id, {
        name: name.trim(),
        description: description.trim(),
      });
      await refreshWorkspaces();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!confirmArchive) {
      setConfirmArchive(true);
      // auto-reset the confirm state after 4s so it doesn't stay armed forever
      setTimeout(() => setConfirmArchive(false), 4000);
      return;
    }
    setBusy(true);
    try {
      await archiveWorkspace(workspace._id);
      rememberArchivedWorkspace(workspace);
      await refreshWorkspaces();
      setActiveWorkspace(null);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to archive workspace");
      setBusy(false);
    }
  };

  const handleLeave = async () => {
    if (!confirmLeave) {
      setConfirmLeave(true);
      setTimeout(() => setConfirmLeave(false), 4000);
      return;
    }
    setBusy(true);
    try {
      await leaveWorkspace(workspace._id);
      await refreshWorkspaces();
      setActiveWorkspace(null);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to leave workspace");
      setBusy(false);
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box ws-settings-box" onClick={(e) => e.stopPropagation()}>
        <div className="ws-settings-header">
          <div className="ws-settings-title">
            <Settings size={20} strokeWidth={1.8} />
            <h2>Workspace Settings</h2>
          </div>
          <button className="ws-settings-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="ws-settings-error">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        {/* ── General settings ── */}
        <form onSubmit={handleSave} className="ws-settings-form">
          <label className="ws-settings-label">Workspace name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canManage}
            required
          />

          <label className="ws-settings-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!canManage}
            placeholder="What's this workspace for? (optional)"
          />

          {!canManage && (
            <p className="ws-settings-hint">
              <Info size={13} />
              Only Owners and Admins can edit workspace settings.
            </p>
          )}

          {canManage && (
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </form>

        <div className="ws-settings-divider" />

        {/* ── Danger zone ── */}
        <div className="ws-danger-zone">
          <h3 className="ws-danger-title">Danger Zone</h3>

          {/* Archive — only visible to those who can manage the workspace */}
          {canManage && (
            <div className="ws-danger-row">
              <div className="ws-danger-info">
                <span className="ws-danger-row-title">Archive this workspace</span>
                <span className="ws-danger-row-sub">
                  Hides it from everyone. Can be restored later from Settings.
                </span>
              </div>
              <button
                className={`ws-danger-btn ${confirmArchive ? "ws-danger-btn--confirm" : ""}`}
                onClick={handleArchive}
                disabled={busy}
              >
                <Archive size={14} />
                {confirmArchive ? "Click again to confirm" : "Archive"}
              </button>
            </div>
          )}

          {/* Leave workspace */}
          <div className="ws-danger-row">
            <div className="ws-danger-info">
              <span className="ws-danger-row-title">Leave this workspace</span>
              <span className="ws-danger-row-sub">
                {isOwner
                  ? "Owners must transfer ownership before leaving."
                  : "You'll lose access to all tasks in this workspace."}
              </span>
            </div>
            <button
              className={`ws-danger-btn ${confirmLeave ? "ws-danger-btn--confirm" : ""}`}
              onClick={handleLeave}
              disabled={isOwner || busy}
              title={isOwner ? "Transfer ownership first" : undefined}
            >
              <LogOut size={14} />
              {isOwner
                ? "Transfer ownership first"
                : confirmLeave
                ? "Click again to confirm"
                : "Leave workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WorkspaceSettingsModal;