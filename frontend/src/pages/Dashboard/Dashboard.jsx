import { useEffect, useState, useContext, useRef, useCallback } from "react";
import "./Dashboard.css";

import {
  Sun, Cloud, Moon, Flame, CheckCircle2,
  ListTodo, BarChart2, Search, LayoutGrid, List,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import TodoModal from "../../components/TodoModal/TodoModal";
import TodoCard from "../../components/TodoCard/TodoCard";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { AuthContext } from "../../context/AuthContext";
import { getTodos, createTodo, deleteTodo, updateTodo } from "../../services/todoAPI";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingIcon = () => {
  const h = new Date().getHours();
  if (h < 12) return <Sun size={30} strokeWidth={1.8} />;
  if (h < 17) return <Cloud size={30} strokeWidth={1.8} />;
  return <Moon size={30} strokeWidth={1.8} />;
};

const getStreak = (todos) => {
  if (!todos.length) return 0;
  const dates = [...new Set(
    todos.filter(t => t.status === "done" && t.updatedAt)
         .map(t => new Date(t.updatedAt).toDateString())
  )];
  if (!dates.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (dates.includes(d.toDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
};

const getScore = (todos) => {
  if (!todos.length) return 0;
  return Math.round(todos.filter(t => t.status === "done").length / todos.length * 100);
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name?.split(" ")[0] || "User";

  const [todos,         setTodos]        = useState([]);
  const [showModal,     setShowModal]    = useState(false);
  const [editingTodo,   setEditingTodo]  = useState(null);
  const [deleteId,      setDeleteId]     = useState(null);
  const [searchTerm,    setSearchTerm]   = useState("");
  const [showScrollTop, setShowScrollTop]= useState(false);
  const [activeFilter,  setActiveFilter] = useState("all");
  const [stripSticky,   setStripSticky]  = useState(false);
  const [searchState,   setSearchState]  = useState("closed");

  // navbarBottom: the pixel distance from viewport top to the bottom edge of the navbar.
  // The sticky strip's `top` is set to this value so it always hugs below the navbar.
  const [navbarBottom, setNavbarBottom] = useState(84);

  // Persist view mode across refreshes
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("todoflow-view-mode") || "grid"
  );

  const heroRef   = useRef(null);
  const navbarRef = useRef(null);

  // Measure the navbar's bottom edge in viewport coordinates (works with fixed positioning)
  const measureNavbar = useCallback(() => {
    if (navbarRef.current) {
      const r = navbarRef.current.getBoundingClientRect();
      // Add 10px breathing room between navbar and strip
      setNavbarBottom(r.bottom + 10);
    }
  }, []);

  const fetchTodos = async () => {
    try { const r = await getTodos(); setTodos(r.data.data); }
    catch (e) { console.log(e); }
  };

  useEffect(() => { fetchTodos(); }, []);

  // Re-measure on mount, resize, and after search open/close
  useEffect(() => {
    measureNavbar();
    window.addEventListener("resize", measureNavbar);
    return () => window.removeEventListener("resize", measureNavbar);
  }, [measureNavbar]);

  useEffect(() => {
    const fn = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Watch hero card exit — when it leaves viewport the strip goes sticky
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([e]) => setStripSticky(!e.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const openSearch = () => {
    setSearchState("opening");
    setTimeout(() => { setSearchState("open"); measureNavbar(); }, 30);
  };

  const closeSearch = () => {
    setSearchState("closing");
    setSearchTerm("");
    setTimeout(() => { setSearchState("closed"); measureNavbar(); }, 320);
  };

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("todoflow-view-mode", mode);
  };

  const addTask    = async (d)    => { try { await createTodo(d);     fetchTodos(); } catch(e){} };
  const updateTask = async (id,d) => { try { await updateTodo(id,d);  fetchTodos(); } catch(e){} };
  const deleteTask = async (id)   => {
    try { await deleteTodo(id); setTodos(p => p.filter(t => t._id !== id)); } catch(e){}
  };

  // ── Star toggle (used by TodoCard's quick-star button) ──
  const toggleStar = async (id, value) => {
    try {
      await updateTodo(id, { star: value });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, star: value } : t)));
    } catch (e) { console.log(e); }
  };

  const handleModalSubmit = async (data) => {
    if (editingTodo) await updateTask(editingTodo._id, data);
    else await addTask(data);
    setEditingTodo(null);
  };

  const pendingCount    = todos.filter(t => t.status === "pending").length;
  const inProgressCount = todos.filter(t => t.status === "inprogress").length;
  const doneCount       = todos.filter(t => t.status === "done").length;
  const streak          = getStreak(todos);
  const score           = getScore(todos);

  // ── Notification / Today / Starred derived data ──
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const overdueTasks = todos.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
  );
  const todayTasks = todos.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) >= startOfToday &&
      new Date(t.dueDate) < endOfToday &&
      t.status !== "done"
  );
  const starredTasks = todos.filter((t) => t.star);

  const filteredTodos = todos
    .filter(t => {
      const s = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const f = activeFilter === "all" || t.status === activeFilter;
      return s && f;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filters = [
    { key: "all",        label: "All",         count: todos.length,    dot: "dot-all"        },
    { key: "pending",    label: "Pending",     count: pendingCount,    dot: "dot-pending"    },
    { key: "inprogress", label: "In Progress", count: inProgressCount, dot: "dot-inprogress" },
    { key: "done",       label: "Done",        count: doneCount,       dot: "dot-done"       },
  ];

  const isSearchOpen = searchState === "open" || searchState === "opening" || searchState === "closing";
  const heroHidden   = isSearchOpen;

  // Sticky strip: top = navbarBottom (viewport px), transform handles centering
  const stickyStyle = stripSticky ? { top: `${navbarBottom}px` } : {};

  return (
    <>
      <div className="dashboard-page">
        <div className="dashboard-container">

          <Navbar
            navbarRef={navbarRef}
            searchState={searchState}
            onSearchOpen={openSearch}
            onSearchClose={closeSearch}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            overdueTasks={overdueTasks}
          />

          {/* ── Hero ── */}
          <div
            className={`hero-card neu-card${heroHidden ? " hero-card--hidden" : ""}`}
            ref={heroRef}
          >
            <div className="hero-top">
              <div className="hero-greeting">
                <span className="hero-icon">{getGreetingIcon()}</span>
                <h1>
                  {getGreeting()},{" "}
                  <span className="hero-username">{userName}</span>!
                </h1>
              </div>
              <p className="hero-sub">Here's your productivity snapshot for today</p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <ListTodo size={18} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{todos.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <CheckCircle2 size={18} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{doneCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <Flame size={18} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <BarChart2 size={18} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{score}%</span>
                <span className="stat-label">Score</span>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Spacer so content doesn't jump when strip goes sticky */}
          {stripSticky && <div className="status-strip-spacer" />}

          {/* ── Status Strip ── */}
          <div
            className={[
              "status-strip",
              stripSticky  ? "status-strip--sticky" : "",
              isSearchOpen ? "status-strip--hidden"  : "",
            ].filter(Boolean).join(" ")}
            style={stickyStyle}
          >
            {filters.map(({ key, label, count, dot }) => (
              <button
                key={key}
                className={`status-pill ${activeFilter === key ? "active" : ""}`}
                onClick={() => setActiveFilter(key)}
              >
                <span className={`pill-dot ${dot}`} />
                {label}
                <span className="pill-count">{count}</span>
              </button>
            ))}
          </div>

          {/* ── View Toggle + Tasks ── */}
          {filteredTodos.length === 0 ? (
            <div className="empty-state neu-card">
              {activeFilter === "all" && !searchTerm ? (
                <>
                  <ListTodo size={48} strokeWidth={1.5} className="empty-icon" />
                  <h2>No tasks yet</h2>
                  <p>Hit the <strong>+</strong> button to create your first task!</p>
                </>
              ) : (
                <>
                  <Search size={48} strokeWidth={1.5} className="empty-icon" />
                  <h2>Nothing here</h2>
                  <p>
                    {searchTerm
                      ? "No tasks match your search."
                      : `No ${activeFilter === "inprogress" ? "in progress" : activeFilter} tasks yet.`}
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => handleSetViewMode("grid")}
                  title="Grid view"
                >
                  <LayoutGrid size={15} strokeWidth={1.8} />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => handleSetViewMode("list")}
                  title="List view"
                >
                  <List size={15} strokeWidth={1.8} />
                </button>
              </div>

              <div className={viewMode === "grid" ? "todo-grid" : "todo-list"}>
                {filteredTodos.map(todo => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    onEdit={t => { setEditingTodo(t); setShowModal(true); }}
                    onDelete={id => setDeleteId(id)}
                    onToggleStar={toggleStar}
                    isListView={viewMode === "list"}
                  />
                ))}
              </div>
            </>
          )}

          <FloatingButton onClick={() => { setEditingTodo(null); setShowModal(true); }} />
        </div>
      </div>

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}

      {showModal && (
        <TodoModal
          editTodo={editingTodo}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={async () => { await deleteTask(deleteId); setDeleteId(null); }}
        />
      )}
    </>
  );
};

export default Dashboard;