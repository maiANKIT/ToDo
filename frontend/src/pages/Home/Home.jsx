import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import {
  ArrowRight, LayoutGrid, List, CalendarDays,
  BarChart2, Flame, CheckCircle2, Circle,
  Clock, Zap, Shield, Search, ChevronRight,
} from "lucide-react";
import "./Home.css";

const FEATURES = [
  {
    icon: <LayoutGrid size={22} strokeWidth={1.8} />,
    title: "Grid & List Views",
    desc: "Switch between card grid and compact list view. See your tasks the way you think.",
    tag: "Dashboard",
  },
  {
    icon: <CalendarDays size={22} strokeWidth={1.8} />,
    title: "Calendar View",
    desc: "Month, Week, and Day views. See exactly when tasks were created and track your history.",
    tag: "Calendar",
  },
  {
    icon: <BarChart2 size={22} strokeWidth={1.8} />,
    title: "Productivity Score",
    desc: "Track completion rate, daily streaks, and your overall score — all in real time.",
    tag: "Stats",
  },
  {
    icon: <Search size={22} strokeWidth={1.8} />,
    title: "Instant Search",
    desc: "Search tasks instantly from the navbar. Results update as you type.",
    tag: "Search",
  },
  {
    icon: <Shield size={22} strokeWidth={1.8} />,
    title: "Secure Auth",
    desc: "JWT-based authentication. Your tasks are private and only visible to you.",
    tag: "Security",
  },
  {
    icon: <Zap size={22} strokeWidth={1.8} />,
    title: "Status Filters",
    desc: "Filter by Pending, In Progress, or Done with one click. Always stay focused.",
    tag: "Focus",
  },
];

const STEPS = [
  { n: "01", title: "Sign up free",       desc: "Create your account in under 30 seconds." },
  { n: "02", title: "Add your tasks",     desc: "Hit + and capture everything on your mind." },
  { n: "03", title: "Track & complete",   desc: "Move tasks forward, build streaks, stay consistent." },
];

const Home = () => {
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [checked,  setChecked]  = useState([false, false, false]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Auto-cycle checklist
  useEffect(() => {
    const run = () => {
      setChecked([false, false, false]);
      setTimeout(() => setChecked([true, false, false]), 800);
      setTimeout(() => setChecked([true, true,  false]), 1800);
      setTimeout(() => setChecked([true, true,  true]),  2800);
    };
    run();
    const id = setInterval(run, 5000);
    return () => clearInterval(id);
  }, []);

  // Auto-cycle feature tabs
  useEffect(() => {
    const id = setInterval(() => setActiveTab(p => (p + 1) % FEATURES.length), 3000);
    return () => clearInterval(id);
  }, []);

  const handleCTA = () => navigate(token ? "/dashboard" : "/signup");

  const PREVIEW_TABS = ["Grid", "List", "Calendar"];

  return (
    <div className="hp">

      {/* ── Navbar ── */}
      <nav className={`hp-nav ${scrolled ? "hp-nav--scrolled" : ""}`}>
        <div className="hp-nav__inner">
          <div className="hp-nav__logo">
            <img src={logo} alt="logo" className="hp-nav__img" />
            <span>TodoFlow</span>
          </div>
          <div className="hp-nav__actions">
            <ThemeToggle />
            {token ? (
              <button className="hp-btn hp-btn--primary" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login"  className="hp-btn hp-btn--ghost">Login</Link>
                <Link to="/signup" className="hp-btn hp-btn--primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="hp-hero">
        {/* Left */}
        <div className="hp-hero__left">
          <div className="hp-badge">
            <Zap size={12} strokeWidth={2.5} /> Simple · Fast · Focused
          </div>

          <h1 className="hp-hero__h1">
            Your tasks,<br />
            <span className="hp-grad">finally organised</span>
          </h1>

          <p className="hp-hero__sub">
            TodoFlow is a clean, fast task manager with calendar views,
            productivity streaks, and smart filtering — built to keep
            you in flow, not fighting your tools.
          </p>

          <div className="hp-hero__ctas">
            <button className="hp-cta-btn" onClick={handleCTA}>
              {token ? "Go to Dashboard" : "Start for free"}
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
            {!token && (
              <Link to="/login" className="hp-link-btn">
                Already have an account <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            )}
          </div>

          {/* Mini stats */}
          <div className="hp-mini-stats">
            <div className="hp-mini-stat">
              <span className="hp-mini-val">3</span>
              <span className="hp-mini-label">View modes</span>
            </div>
            <div className="hp-mini-div" />
            <div className="hp-mini-stat">
              <span className="hp-mini-val">
                <Flame size={16} strokeWidth={2} className="hp-flame" /> Streaks
              </span>
              <span className="hp-mini-label">Daily tracking</span>
            </div>
            <div className="hp-mini-div" />
            <div className="hp-mini-stat">
              <span className="hp-mini-val">100%</span>
              <span className="hp-mini-label">Free to use</span>
            </div>
          </div>
        </div>

        {/* Right — App Preview */}
        <div className="hp-hero__right">
          {/* Tab switcher */}
          <div className="hp-preview-tabs">
            {PREVIEW_TABS.map((t, i) => (
              <button
                key={t}
                className={`hp-preview-tab ${activeTab === i ? "hp-preview-tab--active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Preview window */}
          <div className="hp-preview-window">
            {/* Window chrome */}
            <div className="hp-preview-chrome">
              <div className="hp-chrome-dots">
                <span /><span /><span />
              </div>
              <span className="hp-chrome-url">localhost:5173/dashboard</span>
            </div>

            {/* Grid preview */}
            {activeTab === 0 && (
              <div className="hp-preview-body">
                <div className="hp-preview-hero-bar">
                  <div>
                    <div className="hp-ph-greeting">Good Morning, <span className="hp-grad-sm">Ankit</span>!</div>
                    <div className="hp-ph-sub">Here's your productivity snapshot</div>
                  </div>
                  <div className="hp-ph-stats">
                    <div className="hp-ph-stat"><span>14</span><span>Tasks</span></div>
                    <div className="hp-ph-stat"><span>4</span><span>Done</span></div>
                    <div className="hp-ph-stat flame-stat"><span><Flame size={12} />1</span><span>Streak</span></div>
                    <div className="hp-ph-stat"><span>29%</span><span>Score</span></div>
                  </div>
                </div>
                <div className="hp-preview-filter-row">
                  {["All 14","Pending 9","In Progress 1","Done 4"].map((f, i) => (
                    <span key={i} className={`hp-pf ${i === 0 ? "hp-pf--active" : ""}`}>{f}</span>
                  ))}
                </div>
                <div className="hp-preview-grid">
                  {[
                    { title: "503. Next Greater Element II", status: "pending" },
                    { title: "npm cors", status: "pending" },
                    { title: "Number Theory", status: "inprogress" },
                  ].map((t, i) => (
                    <div key={i} className="hp-preview-card">
                      <span className={`hp-pc-badge hp-pc-badge--${t.status}`}>
                        {t.status === "inprogress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                      <p className="hp-pc-title">{t.title}</p>
                      <div className="hp-pc-actions">
                        <span>Edit</span>
                        <span className="hp-pc-del">Delete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List preview */}
            {activeTab === 1 && (
              <div className="hp-preview-body">
                <div className="hp-preview-list">
                  {[
                    { title: "503. Next Greater Element II", status: "pending",    date: "12/6/2026" },
                    { title: "npm cors",                     status: "pending",    date: "12/6/2026" },
                    { title: "Number Theory",                status: "inprogress", date: "12/6/2026" },
                    { title: "Leetcode 234",                 status: "done",       date: "9/6/2026"  },
                    { title: "Prime List",                   status: "pending",    date: "10/6/2026" },
                  ].map((t, i) => (
                    <div key={i} className="hp-list-row">
                      <span className={`hp-pc-badge hp-pc-badge--${t.status}`}>
                        {t.status === "inprogress" ? "In Progress" : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                      <span className="hp-list-title">{t.title}</span>
                      <span className="hp-list-date">{t.date}</span>
                      <span className="hp-list-edit">Edit</span>
                      <span className="hp-list-del">Delete</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar preview */}
            {activeTab === 2 && (
              <div className="hp-preview-body">
                <div className="hp-preview-cal">
                  <div className="hp-cal-header">
                    <span className="hp-cal-title">June 2026</span>
                    <div className="hp-cal-views">
                      {["Month","Week","Day"].map(v => (
                        <span key={v} className={`hp-cal-view ${v === "Month" ? "hp-cal-view--active" : ""}`}>{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hp-cal-grid">
                    {["S","M","T","W","T","F","S"].map((d, i) => (
                      <div key={i} className="hp-cal-wd">{d}</div>
                    ))}
                    {[...Array(30)].map((_, i) => {
                      const day = i + 1;
                      const hasTasks = [9, 10, 12].includes(day);
                      const isToday  = day === 14;
                      return (
                        <div key={i} className={`hp-cal-day ${isToday ? "hp-cal-day--today" : ""}`}>
                          <span>{day}</span>
                          {hasTasks && (
                            <div className="hp-cal-dots">
                              <span className="hp-cal-dot hp-cal-dot--done" />
                              <span className="hp-cal-dot hp-cal-dot--pending" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checklist floating card */}
          <div className="hp-float-card">
            <p className="hp-float-label">Today's tasks</p>
            {["Ship landing page", "Review PRs", "Push to prod"].map((t, i) => (
              <div key={i} className={`hp-check-row ${checked[i] ? "hp-check-row--done" : ""}`}>
                <div className={`hp-check-box ${checked[i] ? "hp-check-box--checked" : ""}`}>
                  {checked[i] && <CheckCircle2 size={11} strokeWidth={3} />}
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURES
      ══════════════════════════════ */}
      <section className="hp-section">
        <div className="hp-section__inner">
          <div className="hp-section__head">
            <span className="hp-eyebrow">Features</span>
            <h2 className="hp-section__h2">Everything you need,<br />nothing you don't</h2>
          </div>

          <div className="hp-features">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`hp-feature ${activeTab === i ? "hp-feature--active" : ""}`}
                onMouseEnter={() => setActiveTab(i)}
              >
                <div className="hp-feature__icon">{f.icon}</div>
                <div className="hp-feature__body">
                  <div className="hp-feature__top">
                    <h3>{f.title}</h3>
                    <span className="hp-feature__tag">{f.tag}</span>
                  </div>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section className="hp-section hp-section--alt">
        <div className="hp-section__inner">
          <div className="hp-section__head">
            <span className="hp-eyebrow">How it works</span>
            <h2 className="hp-section__h2">Up and running in minutes</h2>
          </div>
          <div className="hp-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="hp-step">
                <span className="hp-step__n">{s.n}</span>
                <div className="hp-step__line" />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA
      ══════════════════════════════ */}
      <section className="hp-cta-section">
        <div className="hp-cta-inner">
          <div className="hp-cta-glow" />
          <h2>Ready to get things done?</h2>
          <p>Join TodoFlow — free, fast, and built for focus.</p>
          <button className="hp-cta-btn hp-cta-btn--lg" onClick={handleCTA}>
            {token ? "Go to Dashboard" : "Create free account"}
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hp-footer">
        <div className="hp-nav__logo">
          <img src={logo} alt="logo" className="hp-nav__img" />
          <span>TodoFlow</span>
        </div>
        <p>© {new Date().getFullYear()} TodoFlow. Built for focus.</p>
      </footer>

    </div>
  );
};

export default Home;