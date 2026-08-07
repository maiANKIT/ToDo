import { useEffect, useState, useContext } from "react";
import { ArrowLeft, Star, LayoutGrid, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/TodoCard/TodoCard";
import TodoModal from "../../components/TodoModal/TodoModal";
import Toast from "../../components/Toast/Toast";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import { WorkspaceContext } from "../../context/WorkspaceContext";
import { getTodos, updateTodo, deleteTodo } from "../../services/todoAPI";
import "../TodayTasks/TodayTasks.css";

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

const StarredTasks = () => {
  const navigate = useNavigate();

  // ── Active workspace (null = Personal) drives which tasks we fetch ──
  const { activeWorkspace } = useContext(WorkspaceContext);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");
  const [dueFilter, setDueFilter] = useState("all");

  // ── Undo-delete toast state ──
  const [pendingDelete, setPendingDelete] = useState(null);

  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("todoflow-view-mode") || "grid"
  );

  const fetchTodos = async () => {
    setLoading(true);
    try {
      // Pass active workspace id — undefined = Personal (backend's
      // "workspace: null" branch); an id = that workspace's tasks.
      const r = await getTodos(activeWorkspace?._id);
      setTodos(r.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  // Re-fetch whenever the active workspace changes (including → Personal)
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace]);

  // Base set: all starred tasks (within the currently fetched scope)
  const starredTasks = todos.filter((t) => t.star);

  const pendingCount    = starredTasks.filter(t => t.status === "pending").length;
  const inProgressCount = starredTasks.filter(t => t.status === "inprogress").length;
  const doneCount       = starredTasks.filter(t => t.status === "done").length;

  const filteredTasks = sortTodos(
    starredTasks.filter((t) => {
      const f = activeFilter === "all" || t.status === activeFilter;
      const due = matchesDueFilter(t, dueFilter);
      return f && due;
    }),
    sortBy
  );

  const filters = [
    { key: "all",        label: "All",         count: starredTasks.length, dot: "dot-all"        },
    { key: "pending",    label: "Pending",     count: pendingCount,        dot: "dot-pending"    },
    { key: "inprogress", label: "In Progress", count: inProgressCount,     dot: "dot-inprogress" },
    { key: "done",       label: "Done",        count: doneCount,           dot: "dot-done"       },
  ];

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem("todoflow-view-mode", mode);
  };

  const toggleStar = async (id, value) => {
    try {
      await updateTodo(id, { star: value });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, star: value } : t)));
    } catch (e) { console.log(e); }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await updateTodo(id, { status: newStatus });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t)));
    } catch (e) { console.log(e); }
  };

  const handleModalSubmit = async (data) => {
    if (editingTodo) {
      try { await updateTodo(editingTodo._id, data); fetchTodos(); } catch (e) {}
    }
    setEditingTodo(null);
  };

  // ── Undo-delete: remove instantly from UI, actually call API after 5s ──
  const deleteTask = (id) => {
    const todoToDelete = todos.find((t) => t._id === id);
    if (!todoToDelete) return;

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

  const handleToastDismiss = () => setPendingDelete(null);

  return (
    <>
      <div className="page-shell">
        <Navbar hideSearch />

        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} />
          </button>
          <div className="page-header-title">
            <Star size={26} strokeWidth={1.8} />
            <h1>Starred Tasks</h1>
          </div>
          <p className="page-header-sub">
            Your important tasks — {starredTasks.length} total
            {activeWorkspace ? ` · ${activeWorkspace.name}` : " · Personal"}
          </p>
        </div>

        {loading ? (
          <p className="page-loading">Loading...</p>
        ) : starredTasks.length === 0 ? (
          <div className="empty-state neu-card">
            <Star size={48} strokeWidth={1.5} className="empty-icon" />
            <h2>No starred tasks</h2>
            <p>Tap the star icon on any task to mark it important.</p>
          </div>
        ) : (
          <>
            <div className="status-strip">
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

            {filteredTasks.length === 0 ? (
              <div className="empty-state neu-card">
                <Search size={48} strokeWidth={1.5} className="empty-icon" />
                <h2>Nothing here</h2>
                <p>No starred tasks match your current filters.</p>
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
                  </div>

                  <FilterDropdown
                    sortBy={sortBy} setSortBy={setSortBy}
                    dueFilter={dueFilter} setDueFilter={setDueFilter}
                    showStarredToggle={false}
                  />
                </div>

                <div className={viewMode === "grid" ? "todo-grid" : "todo-list"}>
                  {filteredTasks.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onEdit={(t) => { setEditingTodo(t); setShowModal(true); }}
                      onDelete={(id) => deleteTask(id)}
                      onToggleStar={toggleStar}
                      onStatusChange={changeStatus}
                      isListView={viewMode === "list"}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showModal && (
        <TodoModal
          editTodo={editingTodo}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {pendingDelete && (
        <Toast
          message={`"${pendingDelete.todo.title}" deleted`}
          onUndo={handleUndoDelete}
          onDismiss={handleToastDismiss}
        />
      )}
    </>
  );
};

export default StarredTasks;