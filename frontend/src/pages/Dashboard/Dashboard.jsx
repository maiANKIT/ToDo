import { useEffect, useState, useContext, useRef, useCallback } from "react";
import "./Dashboard.css";

import {
  Sun, Cloud, Moon, Flame, CheckCircle2,
  ListTodo, BarChart2, Search, LayoutGrid, List, Kanban, Printer,
} from "lucide-react";
import confetti from "canvas-confetti";
import useDebounce from "../../hooks/useDebounce";
import Navbar from "../../components/Navbar/Navbar";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import TodoModal from "../../components/TodoModal/TodoModal";
import TodoCard from "../../components/TodoCard/TodoCard";
import Toast from "../../components/Toast/Toast";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import TaskDetailPanel from "../../components/TaskDetailPanel/TaskDetailPanel";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import QuickAddOverlay from "../../components/QuickAddOverlay/QuickAddOverlay";
import NotificationBanner from "../../components/NotificationBanner/NotificationBanner";
import WeeklyRecap from "../../components/WeeklyRecap/WeeklyRecap";
import OnThisDay from "../../components/OnThisDay/OnThisDay";
import PrintableView from "../../components/PrintableView/PrintableView";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import useDueDateNotifications from "../../hooks/useDueDateNotifications";
import useDocumentTitleBadge from "../../hooks/useDocumentTitleBadge";
import useIdleNudge from "../../hooks/useIdleNudge";
import useFaviconBadge from "../../hooks/useFaviconBadge";
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

const matchesDueFilter = (todo, dueFilter) => {
  if (dueFilter === "all") return true;
  const now = new Date();
  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  if (dueFilter === "nodate") return !due;
  if (!due) return false;
  if (dueFilter === "overdue") return due < now && todo.status !== "done";
  if (dueFilter === "week") {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return due >= now && due <= weekEnd;
  }
  return true;
};

const sortTodos = (list, sortBy) => {
  const arr = [...list];
  switch (sortBy) {
    case "oldest":
      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "duedate":
      return arr.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "az":
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// ── Confetti burst for a single completed task ──
const fireTaskConfetti = () => {
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: ["#667eea", "#764ba2", "#10b981", "#f59e0b"],
  });
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name?.split(" ")[0] || "User";

  const [todos,         setTodos]        = useState([]);
  const [showModal,     setShowModal]    = useState(false);
  const [showQuickAdd,  setShowQuickAdd] = useState(false);
  const [editingTodo,   setEditingTodo]  = useState(null);
  const [viewingTodo,   setViewingTodo]  = useState(null);
  const [searchTerm,    setSearchTerm]   = useState("");
  const [showScrollTop, setShowScrollTop]= useState(false);
  const [activeFilter,  setActiveFilter] = useState("all");
  const [stripSticky,   setStripSticky]  = useState(false);
  const [searchState,   setSearchState]  = useState("closed");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [sortBy,      setSortBy]      = useState("newest");
  const [dueFilter,   setDueFilter]   = useState("all");
  const [starredOnly, setStarredOnly] = useState(false);

  // ── Undo-delete toast state ──
  const [pendingDelete, setPendingDelete] = useState(null); // { todo, timeoutId }

  const [navbarBottom, setNavbarBottom] = useState(84);

  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("todoflow-view-mode") || "grid"
  );

  const heroRef   = useRef(null);
  const navbarRef = useRef(null);

  const measureNavbar = useCallback(() => {
    if (navbarRef.current) {
      const r = navbarRef.current.getBoundingClientRect();
      setNavbarBottom(r.bottom + 10);
    }
  }, []);

  const fetchTodos = async () => {
    try { const r = await getTodos(); setTodos(r.data.data); }
    catch (e) { console.log(e); }
  };

  useEffect(() => { fetchTodos(); }, []);

  // ── Browser notifications: fires once per task, 10 min before it's due ──
  useDueDateNotifications(todos);

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

  // ── Duplicate: clones a task's fields into a fresh task via the same
  //    addTask/createTodo path everything else uses. Status resets to
  //    pending and star resets to false — a duplicate starts fresh.
  //    Estimate carries over since it's descriptive metadata, not state.
  const duplicateTask = (todo) => {
    addTask({
      title: `${todo.title} (Copy)`,
      description: todo.description || "",
      link: todo.link || "",
      status: "pending",
      dueDate: todo.dueDate || null,
      estimate: todo.estimate || "",
      star: false,
    });
  };

  // ── Undo-delete: remove instantly from UI, actually call API after 5s ──
  const deleteTask = (id) => {
    const todoToDelete = todos.find((t) => t._id === id);
    if (!todoToDelete) return;

    // If something else was pending, finalize it first
    if (pendingDelete) {
      clearTimeout(pendingDelete.timeoutId);
      deleteTodo(pendingDelete.todo._id).catch(() => {});
    }

    setTodos((prev) => prev.filter((t) => t._id !== id));

    const timeoutId = setTimeout(async () => {
      try { await deleteTodo(id); } catch (e) {}
      setPendingDelete((curr) => (curr?.todo._id === id ? null : curr));
    }, 5000);

    setPendingDelete({ todo: todoToDelete, timeoutId });
  };

  const handleUndoDelete = () => {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timeoutId);
    setTodos((prev) => [pendingDelete.todo, ...prev]);
    setPendingDelete(null);
  };

  const handleToastDismiss = () => {
    setPendingDelete(null);
  };

  const toggleStar = async (id, value) => {
    try {
      await updateTodo(id, { star: value });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, star: value } : t)));
    } catch (e) { console.log(e); }
  };

  // ── Status change: fires confetti whenever a task newly becomes "done" ──
  // Also used by Kanban drag-and-drop and swipe-right-to-done on TodoCard
  const changeStatus = async (id, newStatus) => {
    const currentTodo = todos.find((t) => t._id === id);
    const justCompleted = currentTodo && currentTodo.status !== "done" && newStatus === "done";

    try {
      await updateTodo(id, { status: newStatus });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
      if (justCompleted) fireTaskConfetti();
    } catch (e) { console.log(e); }
  };

  const handleModalSubmit = async (data) => {
    if (editingTodo) await updateTask(editingTodo._id, data);
    else await addTask(data);
    setEditingTodo(null);
  };

  // ── Keyboard shortcuts: N = new task, / = search, Cmd/Ctrl+K = quick add, Esc = close ──
  useKeyboardShortcuts({
    onNew: () => { setEditingTodo(null); setShowModal(true); },
    onSearch: () => { if (searchState === "closed") openSearch(); },
    onQuickAdd: () => setShowQuickAdd(true),
    onEscape: () => {
      if (showQuickAdd) setShowQuickAdd(false);
      else if (showModal) setShowModal(false);
      else if (viewingTodo) setViewingTodo(null);
      else if (searchState === "open") closeSearch();
    },
  });

  const pendingCount    = todos.filter(t => t.status === "pending").length;
  const inProgressCount = todos.filter(t => t.status === "inprogress").length;
  const doneCount       = todos.filter(t => t.status === "done").length;
  const streak          = getStreak(todos);
  const score           = getScore(todos);

  // ── Idle nudge: if the user's been inactive for a while with pending
  //    tasks left, show a gentle toast + a red-dot badge on the tab favicon ──
  const { nudgeActive, dismissNudge } = useIdleNudge(pendingCount);
  useFaviconBadge(nudgeActive);

  const now = new Date();
  const overdueTasks = todos.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done"
  );

  // ── Tab title badge: "(3) TodoFlow" while there are overdue tasks ──
  useDocumentTitleBadge(overdueTasks.length);

  const filteredTodos = sortTodos(
    todos.filter(t => {
      const s = t.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const f = activeFilter === "all" || t.status === activeFilter;
      const due = matchesDueFilter(t, dueFilter);
      const star = !starredOnly || t.star;
      return s && f && due && star;
    }),
    sortBy
  );

  // ── Kanban: same search/due/star filters, but NOT status filter
  //    (the 3 columns already split by status, so status filter would be redundant) ──
  const filteredTodosForKanban = todos.filter(t => {
    const s = t.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              t.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const due = matchesDueFilter(t, dueFilter);
    const star = !starredOnly || t.star;
    return s && due && star;
  });

  const filters = [
    { key: "all",        label: "All",         count: todos.length,    dot: "dot-all"        },
    { key: "pending",    label: "Pending",     count: pendingCount,    dot: "dot-pending"    },
    { key: "inprogress", label: "In Progress", count: inProgressCount, dot: "dot-inprogress" },
    { key: "done",       label: "Done",        count: doneCount,       dot: "dot-done"       },
  ];

  const isSearchOpen = searchState === "open" || searchState === "opening" || searchState === "closing";
  const heroHidden   = isSearchOpen;

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

          <NotificationBanner />

          <WeeklyRecap todos={todos} />

          <OnThisDay todos={todos} />

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

          {viewMode !== "kanban" && filteredTodos.length === 0 ? (
            <div className="empty-state neu-card">
              {activeFilter === "all" && !debouncedSearchTerm && dueFilter === "all" && !starredOnly ? (
                <>
                  <ListTodo size={48} strokeWidth={1.5} className="empty-icon" />
                  <h2>No tasks yet</h2>
                  <p>Hit the <strong>+</strong> button (or press <strong>N</strong>, or <strong>⌘K</strong> to quick-add) to create your first task!</p>
                </>
              ) : debouncedSearchTerm ? (
                <>
                  <Search size={48} strokeWidth={1.5} className="empty-icon" />
                  <h2>No results for "{debouncedSearchTerm}"</h2>
                  <p>Double-check the spelling, or try a shorter, more general search term.</p>
                  <div className="empty-state-actions">
                    <button
                      className="empty-state-action-btn"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </button>
                    {(activeFilter !== "all" || dueFilter !== "all" || starredOnly) && (
                      <button
                        className="empty-state-action-btn"
                        onClick={() => { setActiveFilter("all"); setDueFilter("all"); setStarredOnly(false); }}
                      >
                        Clear filters too
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Search size={48} strokeWidth={1.5} className="empty-icon" />
                  <h2>Nothing here</h2>
                  <p>No tasks match your current filters.</p>
                  <div className="empty-state-actions">
                    <button
                      className="empty-state-action-btn"
                      onClick={() => { setActiveFilter("all"); setDueFilter("all"); setStarredOnly(false); }}
                    >
                      Clear filters
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="view-toolbar-row">
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
                  <button
                    className={`view-toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
                    onClick={() => handleSetViewMode("kanban")}
                    title="Kanban view"
                  >
                    <Kanban size={15} strokeWidth={1.8} />
                  </button>
                </div>

                <FilterDropdown
                  sortBy={sortBy} setSortBy={setSortBy}
                  dueFilter={dueFilter} setDueFilter={setDueFilter}
                  starredOnly={starredOnly} setStarredOnly={setStarredOnly}
                />

                <button
                  className="view-toggle-btn"
                  onClick={() => window.print()}
                  title="Print current task list"
                >
                  <Printer size={15} strokeWidth={1.8} />
                </button>
              </div>

              {viewMode === "kanban" ? (
                <KanbanBoard
                  todos={filteredTodosForKanban}
                  onEdit={t => { setEditingTodo(t); setShowModal(true); }}
                  onDelete={id => deleteTask(id)}
                  onToggleStar={toggleStar}
                  onStatusChange={changeStatus}
                  onViewDetails={setViewingTodo}
                  onDuplicate={duplicateTask}
                />
              ) : (
                <div className={viewMode === "grid" ? "todo-grid" : "todo-list"}>
                  {filteredTodos.map(todo => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onEdit={t => { setEditingTodo(t); setShowModal(true); }}
                      onDelete={id => deleteTask(id)}
                      onToggleStar={toggleStar}
                      onStatusChange={changeStatus}
                      onViewDetails={setViewingTodo}
                      onDuplicate={duplicateTask}
                      isListView={viewMode === "list"}
                    />
                  ))}
                </div>
              )}
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

      {showQuickAdd && (
        <QuickAddOverlay
          onClose={() => setShowQuickAdd(false)}
          onSubmit={addTask}
        />
      )}

      {viewingTodo && (
        <TaskDetailPanel
          todo={todos.find(t => t._id === viewingTodo._id) || viewingTodo}
          onClose={() => setViewingTodo(null)}
          onEdit={(t) => {
            setViewingTodo(null);
            setEditingTodo(t);
            setShowModal(true);
          }}
          onStatusChange={changeStatus}
          onToggleStar={toggleStar}
          onDuplicate={duplicateTask}
        />
      )}

      {pendingDelete && (
        <Toast
          message={`"${pendingDelete.todo.title}" deleted`}
          onUndo={handleUndoDelete}
          onDismiss={handleToastDismiss}
        />
      )}

      {nudgeActive && !pendingDelete && (
        <Toast
          message={`${pendingCount} task${pendingCount !== 1 ? "s" : ""} still pending today`}
          onDismiss={dismissNudge}
          duration={6000}
        />
      )}

      <PrintableView todos={viewMode === "kanban" ? filteredTodosForKanban : filteredTodos} />
    </>
  );
};

export default Dashboard; 