import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import {
  FiUser, FiMail, FiCalendar, FiCheckCircle,
  FiList, FiTrendingUp, FiLogOut,
} from "react-icons/fi";
import { Flame, BarChart2 } from "lucide-react";
import { getTodos } from "../../services/todoAPI";
import "./Profile.css";

const getStreak = (todos) => {
  if (!todos.length) return 0;
  const doneDates = todos
    .filter((t) => t.status === "done" && t.updatedAt)
    .map((t) => new Date(t.updatedAt).toDateString());
  const uniqueDates = [...new Set(doneDates)];
  if (!uniqueDates.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    if (uniqueDates.includes(day.toDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
};

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos().then((r) => setTodos(r.data.data)).catch(console.log);
  }, []);

  const doneCount       = todos.filter((t) => t.status === "done").length;
  const pendingCount    = todos.filter((t) => t.status === "pending").length;
  const inProgressCount = todos.filter((t) => t.status === "inprogress").length;
  const score           = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;
  const streak          = getStreak(todos);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  const stats = [
    { icon: <FiList size={18} />,                              label: "Total Tasks",  value: todos.length,    color: "stat--total"    },
    { icon: <FiCheckCircle size={18} />,                       label: "Completed",    value: doneCount,        color: "stat--done"     },
    { icon: <FiTrendingUp size={18} />,                        label: "In Progress",  value: inProgressCount,  color: "stat--progress" },
    { icon: <FiList size={18} />,                              label: "Pending",      value: pendingCount,     color: "stat--pending"  },
    { icon: <Flame size={18} strokeWidth={1.8} />,             label: "Day Streak",   value: streak,           color: "stat--streak"   },
    { icon: <BarChart2 size={18} strokeWidth={1.8} />,         label: "Score",        value: `${score}%`,      color: "stat--score"    },
  ];

  return (
    <div className="profile-page">
      {/* hideSearch — search doesn't work on Profile */}
      <Navbar
        hideSearch
        searchState="closed"
        onSearchOpen={() => {}}
        onSearchClose={() => {}}
        searchTerm=""
        onSearchChange={() => {}}
      />

      <div className="profile-container">

        {/* ── Hero ── */}
        <div className="profile-hero neu-card">
          <div className="profile-hero__main">
            <div className="profile-avatar">
              <FiUser size={36} />
            </div>
            <div className="profile-hero__info">
              <h1>{user?.name || "User"}</h1>
              <p className="profile-hero__sub">TodoFlow Member</p>
            </div>
          </div>

          {/* Logout button on the right — replaces ThemeToggle */}
          <div className="profile-hero__actions">
            <button className="profile-logout-btn" onClick={logout}>
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="profile-info-grid">
          <div className="profile-info-card neu-card">
            <FiMail size={18} className="info-icon" />
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="profile-info-card neu-card">
            <FiCalendar size={18} className="info-icon" />
            <div>
              <p className="info-label">Member Since</p>
              <p className="info-value">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="profile-section-title">Productivity Stats</div>
        <div className="profile-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`profile-stat-card neu-card ${s.color}`}>
              <div className="profile-stat-icon">{s.icon}</div>
              <span className="profile-stat-value">{s.value}</span>
              <span className="profile-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Score Bar ── */}
        <div className="profile-score-card neu-card">
          <div className="profile-score-header">
            <span>Overall Productivity Score</span>
            <span className="profile-score-pct">{score}%</span>
          </div>
          <div className="profile-score-bar">
            <div className="profile-score-fill" style={{ width: `${score}%` }} />
          </div>
          <p className="profile-score-sub">
            {score >= 75 ? "Excellent work! Keep it up."        :
             score >= 50 ? "Good progress. Push a little more!" :
             score >= 25 ? "Getting started. Stay consistent!"  :
                           "Create and complete tasks to build your score."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;