import { useNavigate } from "react-router-dom";
import { TbUsers, TbArrowLeft, TbShare2, TbLock, TbBell, TbActivity } from "react-icons/tb";
import { RiTeamLine } from "react-icons/ri";
import { LuSparkles } from "react-icons/lu";
import "./Collaboration.css";

const FEATURES = [
  { icon: <TbShare2 size={13} />,    label: "Shared Workspaces" },
  { icon: <TbLock size={13} />,      label: "Role Permissions"  },
  { icon: <TbBell size={13} />,      label: "Live Notifications" },
  { icon: <TbActivity size={13} />,  label: "Activity Feed"     },
  { icon: <RiTeamLine size={13} />,  label: "Team Analytics"    },
];

const Collaboration = () => {
  const navigate = useNavigate();

  return (
    <div className="collab-page">

      {/* Background orbs */}
      <div className="collab-page__orb collab-page__orb--1" />
      <div className="collab-page__orb collab-page__orb--2" />
      <div className="collab-page__orb collab-page__orb--3" />

      {/* Glass card */}
      <div className="collab-card">

        {/* Icon */}
        <div className="collab-card__icon-wrap">
          <div className="collab-card__ping" />
          <div className="collab-card__ping collab-card__ping--2" />
          <div className="collab-card__icon-bg">
            <TbUsers size={38} />
          </div>
        </div>

        {/* Badge */}
        <div className="collab-card__badge">
          <span className="collab-card__badge-dot" />
          In Development
        </div>

        {/* Title */}
        <h1 className="collab-card__title">
          <span>Collaboration</span>
          <br />is on its way
        </h1>

        {/* Subtitle */}
        <p className="collab-card__subtitle">
          We're building something great. Stay Tuned!
        </p>

        {/* Feature pills */}
        <div className="collab-card__features">
          {FEATURES.map((f) => (
            <span key={f.label} className="collab-card__feature-pill">
              {f.icon}
              {f.label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="collab-card__progress-wrap">
          <div className="collab-card__progress-header">
            <span className="collab-card__progress-label">Build Progress</span>
            <span className="collab-card__progress-pct">62%</span>
          </div>
          <div className="collab-card__progress-track">
            <div className="collab-card__progress-bar" />
          </div>
        </div>

        {/* CTA */}
        <button className="collab-card__btn" onClick={() => navigate("/dashboard")}>
          <TbArrowLeft size={16} />
          Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default Collaboration;