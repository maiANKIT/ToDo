import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiCheck,
  FiX,
  FiLogIn,
  FiClock,
  FiAlertCircle,
  FiUsers,
} from "react-icons/fi";
import {
  getInvitationByToken,
  acceptInvitation,
  rejectInvitation,
} from "../../services/workspaceAPI";
import "./InvitePage.css";

const InvitePage = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getInvitationByToken(token);
        setInvitation(res.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Could not load this invitation"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token, user]);

  const handleAccept = async () => {
    setProcessing(true);
    try {
      await acceptInvitation(token);
      setResult({ type: "success", text: "Invitation accepted" });
      setTimeout(() => navigate("/collaboration"), 1200);
    } catch (err) {
      setResult({
        type: "error",
        text: err?.response?.data?.message || "Could not accept invitation",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await rejectInvitation(token);
      setResult({ type: "info", text: "Invitation declined" });
    } catch (err) {
      setResult({
        type: "error",
        text: err?.response?.data?.message || "Could not decline invitation",
      });
    } finally {
      setProcessing(false);
    }
  };

  // ── Not logged in ──
  if (!user) {
    return (
      <div className="invite-page">
        <div className="invite-card neu-card">
          <div className="invite-icon">
            <FiLogIn size={28} />
          </div>
          <h2>Log in to view this invitation</h2>
          <p className="invite-muted">
            You need to be signed in with the invited email address to
            continue.
          </p>
          <div className="invite-actions">
            <Link to="/login" className="invite-btn invite-btn-primary">
              Log In
            </Link>
            <Link to="/signup" className="invite-btn invite-btn-ghost">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-page">
      <div className="invite-card neu-card">
        {loading && <p className="invite-muted">Loading invitation...</p>}

        {!loading && error && (
          <>
            <div className="invite-icon invite-icon-error">
              <FiAlertCircle size={28} />
            </div>
            <h2>Invitation unavailable</h2>
            <p className="invite-muted">{error}</p>
            <Link to="/collaboration" className="invite-btn invite-btn-ghost">
              Go to Collaboration
            </Link>
          </>
        )}

        {!loading && !error && invitation && !result && (
          <>
            <div className="invite-icon">
              <FiUsers size={28} />
            </div>

            <h2>{invitation.workspaceName}</h2>

            {invitation.workspaceDescription && (
              <p className="invite-muted">{invitation.workspaceDescription}</p>
            )}

            <p className="invite-detail">
              <strong>{invitation.invitedByName}</strong> invited you as{" "}
              <span className="invite-role-tag">{invitation.role}</span>
            </p>

            {invitation.status !== "Pending" && (
              <p className="invite-status-note">
                <FiClock /> This invitation is {invitation.status.toLowerCase()}.
              </p>
            )}

            {invitation.workspaceArchived && (
              <p className="invite-status-note">
                <FiAlertCircle /> This workspace has been archived.
              </p>
            )}

            {invitation.status === "Pending" && !invitation.workspaceArchived && (
              <div className="invite-actions">
                <button
                  className="invite-btn invite-btn-primary"
                  onClick={handleAccept}
                  disabled={processing}
                >
                  <FiCheck /> Accept
                </button>
                <button
                  className="invite-btn invite-btn-ghost"
                  onClick={handleReject}
                  disabled={processing}
                >
                  <FiX /> Decline
                </button>
              </div>
            )}
          </>
        )}

        {result && (
          <div className={`invite-result invite-result-${result.type}`}>
            {result.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;