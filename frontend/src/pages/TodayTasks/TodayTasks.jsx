import { useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, LayoutGrid, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/TodoCard/TodoCard";
import TodoModal from "../../components/TodoModal/TodoModal";
import Toast from "../../components/Toast/Toast";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import TaskDetailPanel from "../../components/TaskDetailPanel/TaskDetailPanel";
import { getTodos, updateTodo, deleteTodo } from "../../services/todoAPI";
import "./TodayTasks.css";

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

const isToday = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
};

const TodayTasks = () => {
  const navigate = useNavigate();
  const [todos,        setTodos]       = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [editingTodo,  setEditingTodo] = useState(null);
  const [viewingTodo,  setViewingTodo] = useState(null);
  const [showModal,    setShowModal]   = useState(false);
  const [activeFilter, setActiveFilter]= useState("all");
  const [sortBy,       setSortBy]      = useState("newest");
  const [pendingDelete,setPendingDelete]= useState(null);

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

  // ── Today: due today OR created today ──
  const todayTasks = todos.filter(
    (t) => isToday(t.dueDate) || isToday(t.createdAt)
  );

  const pendingCount    = todayTasks.filter(t => t.status === "pending").length;
  const inProgressCount = todayTasks.filter(t => t.status === "inprogress").length;
  const doneCount       = todayTasks.filter(t => t.status === "done").length;

  const filteredTasks = sortTodos(
    todayTasks.filter((t) =>
      activeFilter === "all" || t.status === activeFilter
    ),
    sortBy
  );

  const filters = [
    { key: "all",        label: "All",         count: todayTasks.length, dot: "dot-all"        },
    { key: "pending",    label: "Pending",     count: pendingCount,      dot: "dot-pending"    },
    { key: "inprogress", label: "In Progress", count: inProgressCount,   dot: "dot-inprogress" },
    { key: "done",       label: "Done",        count: doneCount,         dot: "dot-done"       },
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

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <>
      <div className="page-shell">
        <Navbar hideSearch />

        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={18} />
          </button>
          <div className="page-header-title">
            <CalendarCheck size={26} strokeWidth={1.8} />
            <h1>Today's Tasks</h1>
          </div>
          <p className="page-header-sub">
            {todayLabel} · {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <p className="page-loading">Loading...</p>
        ) : todayTasks.length === 0 ? (
          <div className="empty-state neu-card">
            <CalendarCheck size={48} strokeWidth={1.5} className="empty-icon" />
            <h2>Nothing due today</h2>
            <p>Tasks created or due today will appear here.</p>
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
                <p>No today's tasks match your current filter.</p>
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
                    dueFilter="all"
                    setDueFilter={() => {}}
                    showStarredToggle={false}
                    hideDueFilter
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
                      onViewDetails={setViewingTodo}
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

export default TodayTasks;  