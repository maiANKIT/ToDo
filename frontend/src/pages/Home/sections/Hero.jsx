import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">

      <div className="hero-background">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="container hero-container">

        {/* LEFT */}

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
        >

          <div className="hero-badge">

            New • Workspace Collaboration

          </div>

          <h1>

            The smarter way
            <br />

            to manage

            <span> your work.</span>

          </h1>

          <p>

            TodoFlow helps individuals and teams
            organize tasks, collaborate in shared
            workspaces, track productivity,
            and never miss deadlines.

          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started

              <ArrowRight size={18} />

            </button>

            <button className="hero-secondary-btn">

              <Play size={18} />

              Watch Demo

            </button>

          </div>

          <div className="hero-stats">

            <div>

              <h3>10K+</h3>

              <span>Tasks Managed</span>

            </div>

            <div>

              <h3>500+</h3>

              <span>Users</span>

            </div>

            <div>

              <h3>99.9%</h3>

              <span>Uptime</span>

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: .8,
            delay: .15
          }}
        >

          <div className="hero-dashboard">

  <div className="dashboard-toolbar">

    <div>

      <h3>Good Morning</h3>

      <span>Let's make today productive.</span>

    </div>

    <button>

      + New Task

    </button>

  </div>

  {/* Stats */}

  <div className="dashboard-overview">

    <div className="overview-card">

      <strong>12</strong>

      <span>Pending</span>

    </div>

    <div className="overview-card">

      <strong>4</strong>

      <span>In Progress</span>

    </div>

    <div className="overview-card">

      <strong>18</strong>

      <span>Completed</span>

    </div>

    <div className="overview-card">

      <strong>92%</strong>

      <span>Productivity</span>

    </div>

  </div>

  {/* Search */}

  <div className="dashboard-search">

    <input
      type="text"
      placeholder="Search your tasks..."
      readOnly
    />

  </div>

  {/* Tasks */}

  <div className="dashboard-task-list">

    <div className="dashboard-task">

      <div>

        <h4>Landing Page Design</h4>

        <span>High Priority</span>

      </div>

      <label className="task-status pending">

        Pending

      </label>

    </div>

    <div className="dashboard-task">

      <div>

        <h4>Workspace Meeting</h4>

        <span>Today · 11:30 AM</span>

      </div>

      <label className="task-status progress">

        In Progress

      </label>

    </div>

    <div className="dashboard-task">

      <div>

        <h4>Solve LeetCode Contest</h4>

        <span>Evening</span>

      </div>

      <label className="task-status done">

        Done

      </label>

    </div>

  </div>

  {/* Bottom */}

  <div className="dashboard-bottom">

    <div className="dashboard-widget">

      <h5>Workspace</h5>

      <strong>5 Members</strong>

      <span>2 Active Projects</span>

    </div>

    <div className="dashboard-widget">

      <h5>Analytics</h5>

      <strong>92%</strong>

      <div className="dashboard-progress">

        <div className="dashboard-progress-fill"></div>

      </div>

    </div>

  </div>

</div>

        </motion.div>

      </div>

    </section>
  );
}