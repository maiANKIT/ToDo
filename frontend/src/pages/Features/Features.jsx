import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {
  FiStar, FiLayout, FiTrendingUp, FiCheckCircle,
  FiLink2, FiCalendar, FiSliders, FiRotateCcw,
} from "react-icons/fi";
import "./Features.css";

const FEATURES = [
  {
    icon: <FiLayout size={20} />,
    title: "Three Ways to View Your Tasks",
    desc: "Switch between Grid, List, and Kanban board layouts. Drag and drop cards between Pending, In Progress, and Done columns in Kanban view.",
    color: "feat--blue",
  },
  {
    icon: <FiCheckCircle size={20} />,
    title: "Task Detail Panel",
    desc: "Click any task title to open a clean slide-in panel with full details, status, due date, and link — without jumping straight into edit mode.",
    color: "feat--green",
  },
  {
    icon: <FiLink2 size={20} />,
    title: "Smart Link Previews",
    desc: "Attach a link to any task and TodoFlow automatically fetches the site's favicon — so your LeetCode, GitHub, or YouTube tasks are visually recognizable at a glance.",
    color: "feat--purple",
  },
  {
    icon: <FiTrendingUp size={20} />,
    title: "Productivity Charts",
    desc: "Your Profile page includes a completion-rate trend line, a GitHub-style activity heatmap, and a daily-completions bar chart — all computed live from your tasks.",
    color: "feat--orange",
  },
  {
    icon: <FiCalendar size={20} />,
    title: "Today & Starred Views",
    desc: "Jump straight to tasks due or created today, or pin your most important tasks to a dedicated Starred view — both with their own filters and sorting.",
    color: "feat--pink",
  },
  {
    icon: <FiSliders size={20} />,
    title: "Themes",
    desc: "Six built-in themes — Light, Dark, Ocean, Sunset, Forest, and Lavender — switchable anytime from the Theme menu, saved automatically for next time.",
    color: "feat--teal",
  },
  {
    icon: <FiRotateCcw size={20} />,
    title: "Undo Delete",
    desc: "Deleted a task by mistake? You've got 5 seconds to undo it from the toast notification before it's gone for good.",
    color: "feat--red",
  },
  {
    icon: <FiStar size={20} />,
    title: "Celebrate Completion",
    desc: "Finish a task and watch a confetti burst celebrate the win — small delight, big motivation.",
    color: "feat--amber",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="features-page">
      <Navbar hideSearch />

      <div className="features-container">
        <div className="features-header">
          <h1>What TodoFlow Can Do</h1>
          <p>A quick tour of everything built into your task manager.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className={`feature-card neu-card ${f.color}`}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="features-footer">
          <button className="features-back-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;