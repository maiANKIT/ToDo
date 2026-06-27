import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import logo from "../../assets/images/logo.png";
import {
  ArrowRight,
  LayoutGrid,
  List,
  CalendarDays,
  BarChart2,
  Flame,
  CheckCircle2,
  Shield,
  Search,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import "./Home.css";

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: LayoutGrid, title: "Grid & List Views", desc: "Switch between card grid and compact list view. See your tasks the way you think.", tag: "Dashboard" },
  { icon: CalendarDays, title: "Calendar View", desc: "Month, Week, and Day views. See exactly when tasks were created and track your history.", tag: "Calendar" },
  { icon: BarChart2, title: "Productivity Score", desc: "Track completion rate, daily streaks, and your overall score — all in real time.", tag: "Stats" },
  { icon: Search, title: "Instant Search", desc: "Search tasks instantly from the navbar. Results update as you type.", tag: "Search" },
  { icon: Shield, title: "Secure Auth", desc: "JWT-based authentication. Your tasks are private and only visible to you.", tag: "Security" },
  { icon: Zap, title: "Status Filters", desc: "Filter by Pending, In Progress, or Done with one click. Always stay focused.", tag: "Focus" },
];

const STEPS = [
  { n: "01", title: "Sign up free", desc: "Create your account in under 30 seconds." },
  { n: "02", title: "Add your tasks", desc: "Hit + and capture everything on your mind." },
  { n: "03", title: "Track & complete", desc: "Move tasks forward, build streaks, stay consistent." },
];

const PREVIEW_TABS = [
  { label: "Grid", icon: LayoutGrid },
  { label: "List", icon: List },
  { label: "Calendar", icon: CalendarDays },
];

const GRID_TASKS = [
  { title: "503. Next Greater Element II", status: "pending" },
  { title: "npm cors", status: "pending" },
  { title: "Number Theory", status: "inprogress" },
];

const LIST_TASKS = [
  { title: "503. Next Greater Element II", status: "pending", date: "12/6/2026" },
  { title: "npm cors", status: "pending", date: "12/6/2026" },
  { title: "Number Theory", status: "inprogress", date: "12/6/2026" },
  { title: "Leetcode 234", status: "done", date: "9/6/2026" },
  { title: "Prime List", status: "pending", date: "10/6/2026" },
];

/* ------------------------------------------------------------------ */
/* Motion variants                                                     */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const wordUp = {
  hidden: { opacity: 0, y: "100%" },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */

const Home = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState([false, false, false]);
  const [activeTab, setActiveTab] = useState(0);
  const cycleRef = useRef(null);
  const previewRef = useRef(null);

  /* navbar shrink on scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* auto-cycle checklist */
  useEffect(() => {
    const run = () => {
      setChecked([false, false, false]);
      setTimeout(() => setChecked([true, false, false]), 800);
      setTimeout(() => setChecked([true, true, false]), 1800);
      setTimeout(() => setChecked([true, true, true]), 2800);
    };
    run();
    const id = setInterval(run, 5000);
    return () => clearInterval(id);
  }, []);

  /* auto-cycle preview tabs, restartable on manual click */
  const restartCycle = () => {
    clearInterval(cycleRef.current);
    cycleRef.current = setInterval(() => {
      setActiveTab((p) => (p + 1) % PREVIEW_TABS.length);
    }, 3600);
  };
  useEffect(() => {
    restartCycle();
    return () => clearInterval(cycleRef.current);
  }, []);
  const selectTab = (i) => {
    setActiveTab(i);
    restartCycle();
  };

  /* spring tilt on the preview window */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });

  const handlePreviewMove = (e) => {
    const r = previewRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const resetPreview = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const handleCTA = () => navigate(token ? "/dashboard" : "/signup");

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
                <Link to="/login" className="hp-btn hp-btn--ghost">Login</Link>
                <Link to="/signup" className="hp-btn hp-btn--primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="hp-hero">
        {/* Left */}
        <motion.div
          className="hp-hero__left"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.div className="hp-badge" variants={fadeUp}>
            <Sparkles size={12} strokeWidth={2.5} /> Simple · Fast · Focused
          </motion.div>

          <h1 className="hp-hero__h1">
            <span className="hp-word-mask">
              <motion.span initial="hidden" animate="show" variants={wordUp} transition={{ delay: 0.1 }}>
                Your tasks,
              </motion.span>
            </span>
            <br />
            <span className="hp-word-mask">
              <motion.span
                className="hp-grad"
                initial="hidden"
                animate="show"
                variants={wordUp}
                transition={{ delay: 0.25 }}
              >
                finally organised
              </motion.span>
            </span>
          </h1>

          <motion.p className="hp-hero__sub" variants={fadeUp}>
            TodoFlow is a clean, fast task manager with calendar views,
            productivity streaks, and smart filtering — built to keep
            you in flow, not fighting your tools.
          </motion.p>

          <motion.div className="hp-hero__ctas" variants={fadeUp}>
            <motion.button
              className="hp-cta-btn"
              onClick={handleCTA}
              whileHover={{ y: -3, boxShadow: "0 14px 32px rgba(102,126,234,0.35)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {token ? "Go to Dashboard" : "Start for free"}
              <ArrowRight size={16} strokeWidth={2.2} />
            </motion.button>
            {!token && (
              <Link to="/login" className="hp-link-btn">
                Already have an account <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            )}
          </motion.div>

          <motion.div className="hp-mini-stats" variants={fadeUp}>
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
          </motion.div>
        </motion.div>

        {/* Right — App Preview */}
        <motion.div
          className="hp-hero__right"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div className="hp-preview-tabs">
            {PREVIEW_TABS.map((t, i) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  className={`hp-preview-tab ${activeTab === i ? "hp-preview-tab--active" : ""}`}
                  onClick={() => selectTab(i)}
                >
                  <Icon size={13} style={{ marginRight: 5, verticalAlign: -2 }} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <motion.div
            ref={previewRef}
            className="hp-preview-window"
            onMouseMove={handlePreviewMove}
            onMouseLeave={resetPreview}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
          >
            <div className="hp-preview-chrome">
              <div className="hp-chrome-dots"><span /><span /><span /></div>
              <span className="hp-chrome-url">https://to-do-eight-plum.vercel.app/</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="hp-preview-body"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                {activeTab === 0 && (
                  <>
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
                      {["All 14", "Pending 9", "In Progress 1", "Done 4"].map((f, i) => (
                        <span key={i} className={`hp-pf ${i === 0 ? "hp-pf--active" : ""}`}>{f}</span>
                      ))}
                    </div>
                    <div className="hp-preview-grid">
                      {GRID_TASKS.map((t, i) => (
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
                  </>
                )}

                {activeTab === 1 && (
                  <div className="hp-preview-list">
                    {LIST_TASKS.map((t, i) => (
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
                )}

                {activeTab === 2 && (
                  <div className="hp-preview-cal">
                    <div className="hp-cal-header">
                      <span className="hp-cal-title">June 2026</span>
                      <div className="hp-cal-views">
                        {["Month", "Week", "Day"].map((v) => (
                          <span key={v} className={`hp-cal-view ${v === "Month" ? "hp-cal-view--active" : ""}`}>{v}</span>
                        ))}
                      </div>
                    </div>
                    <div className="hp-cal-grid">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="hp-cal-wd">{d}</div>
                      ))}
                      {[...Array(30)].map((_, i) => {
                        const day = i + 1;
                        const hasTasks = [9, 10, 12].includes(day);
                        const isToday = day === 14;
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
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Checklist floating card */}
          <div className="hp-float-card">
            <p className="hp-float-label">Today's tasks</p>
            {["Ship landing page", "Review PRs", "Push to prod"].map((t, i) => (
              <div key={i} className={`hp-check-row ${checked[i] ? "hp-check-row--done" : ""}`}>
                <div className={`hp-check-box ${checked[i] ? "hp-check-box--checked" : ""}`}>
                  <AnimatePresence>
                    {checked[i] && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <CheckCircle2 size={11} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="hp-section">
        <div className="hp-section__inner">
          <motion.div
            className="hp-section__head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="hp-eyebrow">Features</span>
            <h2 className="hp-section__h2">Everything you need,<br />nothing you don't</h2>
          </motion.div>

          <motion.div
            className="hp-features"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  className="hp-feature"
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <div className="hp-feature__icon"><Icon size={22} strokeWidth={1.8} /></div>
                  <div className="hp-feature__body">
                    <div className="hp-feature__top">
                      <h3>{f.title}</h3>
                      <span className="hp-feature__tag">{f.tag}</span>
                    </div>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="hp-section hp-section--alt">
        <div className="hp-section__inner">
          <motion.div
            className="hp-section__head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="hp-eyebrow">How it works</span>
            <h2 className="hp-section__h2">Up and running in minutes</h2>
          </motion.div>

          <motion.div
            className="hp-steps"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {STEPS.map((s, i) => (
              <motion.div key={i} className="hp-step" variants={fadeUp}>
                <span className="hp-step__n">{s.n}</span>
                <motion.div
                  className="hp-step__line"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="hp-cta-section">
        <motion.div
          className="hp-cta-inner"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
        >
          <motion.div
            className="hp-cta-glow"
            animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.h2 variants={fadeUp}>Ready to get things done?</motion.h2>
          <motion.p variants={fadeUp}>Join TodoFlow — free, fast, and built for focus.</motion.p>
          <motion.button
            className="hp-cta-btn hp-cta-btn--lg"
            onClick={handleCTA}
            variants={fadeUp}
            whileHover={{ y: -3, boxShadow: "0 14px 32px rgba(102,126,234,0.35)" }}
            whileTap={{ scale: 0.96 }}
          >
            {token ? "Go to Dashboard" : "Create free account"}
            <ArrowRight size={18} strokeWidth={2.2} />
          </motion.button>
        </motion.div>
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