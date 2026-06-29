import { useEffect, useState } from "react";
import { ArrowLeft, Star, LayoutGrid, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/TodoCard/TodoCard";
import TodoModal from "../../components/TodoModal/TodoModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
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
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");
  const [dueFilter, setDueFilter] = useState("all");

  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("todoflow-view-mode") || "grid"
  );

  const fetchTodos = async () => {
    try {
      const r = await getTodos();
      setTodos(r.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTodos(); }, []);

  // Base set: all starred tasks
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

  const handleModalSubmit = async (data) => {
    if (editingTodo) {
      try { await updateTodo(editingTodo._id, data); fetchTodos(); } catch (e) {}
    }
    setEditingTodo(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTodo(deleteId);
      setTodos((p) => p.filter((t) => t._id !== deleteId));
    } catch (e) {}
    setDeleteId(null);
  };

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
                      onDelete={(id) => setDeleteId(id)}
                      onToggleStar={toggleStar}
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

      {deleteId && (
        <DeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default StarredTasks;