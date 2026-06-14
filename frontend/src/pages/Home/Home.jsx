import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import {
  BarChart2,
  ListTodo,
  Search,
  Moon,
  Zap,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Flame,
  Circle,
  Calendar // <-- Added Calendar icon
} from "lucide-react";
import "./Home.css";

// Updated features based on the core pillars!
const features = [
  {
    icon: <BarChart2 size={24} strokeWidth={1.8} />,
    title: "Productivity Dashboard",
    desc: "Track daily streaks, completion rates, and boost your overall productivity score.",
  },
  {
    icon: <Calendar size={24} strokeWidth={1.8} />,
    title: "Deep Calendar Sync",
    desc: "Plan your life, not just your day. View tasks seamlessly by month, week, or day.",
  },
  {
    icon: <SlidersHorizontal size={24} strokeWidth={1.8} />,
    title: "Flexible Workspaces",
    desc: "Organize your way. Switch between Kanban boards, grid, or list views instantly.",
  },
  {
    icon: <Search size={24} strokeWidth={1.8} />,
    title: "Lightning Fast Search",
    desc: "Find any task instantly with zero delays. Quick-edit modals keep you in the flow.",
  },
  {
    icon: <Moon size={24} strokeWidth={1.8} />,
    title: "Built-in Dark Mode",
    desc: "Looks great day or night. Automatically follows your system's theme preference.",
  },
  {
    icon: <Shield size={24} strokeWidth={1.8} />,
    title: "Secure & Private",
    desc: "Your tasks are yours alone. Fully protected behind secure JWT authentication.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an account",
    desc: "Sign up in seconds",
  },
  {
    number: "02",
    title: "Add your tasks",
    desc: "Hit + and capture anything on your mind instantly.",
  },
  {
    number: "03",
    title: "Stay productive",
    desc: "Track progress, hit streaks, and get things done.",
  },
];

const Home = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState([false, false, false]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-check tasks one by one
  useEffect(() => {
    const timers = [
      setTimeout(() => setChecked([true, false, false]), 1000),
      setTimeout(() => setChecked([true, true, false]), 2200),
      setTimeout(() => setChecked([true, true, true]), 3400),
      setTimeout(() => setChecked([false, false, false]), 5000),
    ];
    const loop = setInterval(() => {
      setChecked([false, false, false]);
      setTimeout(() => setChecked([true, false, false]), 1000);
      setTimeout(() => setChecked([true, true, false]), 2200);
      setTimeout(() => setChecked([true, true, true]), 3400);
    }, 6000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  const handleCTA = () => {
    navigate(token ? "/dashboard" : "/signup");
  };

  return (
    <div className="home-page">

      {/* ── Navbar ── */}
      <nav className={`home-nav ${scrolled ? "home-nav--scrolled" : ""}`}>
        <div className="home-nav__inner">
          <div className="home-nav__logo">
            <img src={logo} alt="logo" className="home-nav__logo-img" />
            <span>TodoFlow</span>
          </div>
          <div className="home-nav__actions">
            <ThemeToggle />
            {token ? (
              <button className="home-nav__btn home-nav__btn--primary" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="home-nav__btn home-nav__btn--ghost">Login</Link>
                <Link to="/signup" className="home-nav__btn home-nav__btn--primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero__left">
          <div className="home-hero__badge">
            <Zap size={13} strokeWidth={2.5} />
            Simple. Fast. Focused.
          </div>

          <h1 className="home-hero__title">
            The task manager
            <br />
            <span className="home-hero__accent">that stays out of your way</span>
          </h1>

          <p className="home-hero__sub">
            Capture tasks, track progress, and build streaks — without the clutter of bloated project tools.
          </p>

          <div className="home-hero__actions">
            <button className="home-cta-btn" onClick={handleCTA}>
              {token ? "Go to Dashboard" : "Get started free"}
              <ArrowRight size={17} strokeWidth={2.2} />
            </button>
            {!token && (
              <Link to="/login" className="home-secondary-btn">
                I already have an account
              </Link>
            )}
          </div>
        </div>

        {/* ── 4-card floating grid ── */}
        <div className="home-hero__right">

          {/* Card 1 — Kanban */}
          <div className="hero-card-float hero-card-float--1">
            <p className="hcard-label">Board</p>
            <div className="kanban-cols">
              <div className="kanban-col">
                <span className="kanban-col-title dot-pending">Pending</span>
                <div className="kanban-item">Plan API</div>
                <div className="kanban-item">Write docs</div>
              </div>
              <div className="kanban-col">
                <span className="kanban-col-title dot-inprogress">Active</span>
                <div className="kanban-item">Build UI</div>
              </div>
              <div className="kanban-col">
                <span className="kanban-col-title dot-done">Done</span>
                <div className="kanban-item kanban-item--done">Setup DB</div>
                <div className="kanban-item kanban-item--done">Auth flow</div>
              </div>
            </div>
          </div>

          {/* Card 2 — Progress bars */}
          <div className="hero-card-float hero-card-float--2">
            <p className="hcard-label">This week</p>
            <div className="prog-rows">
              <div className="prog-row">
                <span>Design</span>
                <div className="prog-bar"><div className="prog-fill" style={{ width: "85%", animationDelay: "0.2s" }} /></div>
                <span className="prog-pct">85%</span>
              </div>
              <div className="prog-row">
                <span>Dev</span>
                <div className="prog-bar"><div className="prog-fill" style={{ width: "62%", animationDelay: "0.4s" }} /></div>
                <span className="prog-pct">62%</span>
              </div>
              <div className="prog-row">
                <span>Review</span>
                <div className="prog-bar"><div className="prog-fill prog-fill--purple" style={{ width: "40%", animationDelay: "0.6s" }} /></div>
                <span className="prog-pct">40%</span>
              </div>
            </div>
            <div className="prog-stats">
              <div className="prog-stat">
                <Flame size={14} strokeWidth={2} className="flame-icon" />
                <span>5 day streak</span>
              </div>
              <div className="prog-stat">
                <span className="prog-score">67%</span>
                <span>score</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Checklist */}
          <div className="hero-card-float hero-card-float--3">
            <p className="hcard-label">Today's tasks</p>
            <div className="checklist">
              {[
                "Ship landing page",
                "Review PRs",
                "Update README",
              ].map((task, i) => (
                <div key={i} className={`check-item ${checked[i] ? "check-item--done" : ""}`}>
                  <div className={`check-box ${checked[i] ? "check-box--checked" : ""}`}>
                    {checked[i] && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 — Task card with glow */}
          <div className="hero-card-float hero-card-float--4">
            <p className="hcard-label">Latest task</p>
            <div className="task-glow-card">
              <span className="tgc-badge tgc-badge--inprogress">In Progress</span>
              <p className="tgc-title">Redesign dashboard</p>
              <div className="tgc-bar">
                <div className="tgc-bar-fill" />
              </div>
              <div className="tgc-meta">
                <span>Due tomorrow</span>
                <span className="tgc-pct">70%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-features">
        <div className="home-section-inner">
          <p className="home-section-eyebrow">What's inside</p>
          <h2 className="home-section-title">Everything you need, nothing you don't</h2>
          <div className="home-features__grid">
            {features.map((f, i) => (
              <div key={i} className="home-feature-card">
                <div className="home-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-steps">
        <div className="home-section-inner">
          <p className="home-section-eyebrow">How it works</p>
          <h2 className="home-section-title">Up and running in minutes</h2>
          <div className="home-steps__row">
            {steps.map((s, i) => (
              <div key={i} className="home-step">
                <span className="home-step__number">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta-section">
        <div className="home-section-inner home-cta-inner">
          <h2>Ready to get things done?</h2>
          <p>Join TodoFlow and start building better habits today.</p>
          <button className="home-cta-btn home-cta-btn--large" onClick={handleCTA}>
            {token ? "Go to Dashboard" : "Create free account"}
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-nav__logo">
          <img src={logo} alt="logo" className="home-nav__logo-img" />
          <span>TodoFlow</span>
        </div>
        <p>© {new Date().getFullYear()} TodoFlow. Built for focus.</p>
      </footer>

    </div>
  );
};

export default Home;