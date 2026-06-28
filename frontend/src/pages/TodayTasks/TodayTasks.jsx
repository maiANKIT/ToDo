import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/TodoCard/TodoCard";
import TodoModal from "../../components/TodoModal/TodoModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { getTodos, updateTodo, deleteTodo } from "../../services/todoAPI";
import "./TodayTasks.css";

const TodayTasks = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTodos = async () => {
    try {
      const r = await getTodos();
      setTodos(r.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const todayTasks = todos.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) >= startOfToday &&
      new Date(t.dueDate) < endOfToday
  );

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
            <CalendarDays size={26} strokeWidth={1.8} />
            <h1>Today's Tasks</h1>
          </div>
          <p className="page-header-sub">
            Tasks due today — {todayTasks.length} total
          </p>
        </div>

        {loading ? (
          <p className="page-loading">Loading...</p>
        ) : todayTasks.length === 0 ? (
          <div className="empty-state neu-card">
            <CalendarDays size={48} strokeWidth={1.5} className="empty-icon" />
            <h2>Nothing due today</h2>
            <p>Tasks with today's due date will show up here.</p>
          </div>
        ) : (
          <div className="todo-grid">
            {todayTasks.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onEdit={(t) => { setEditingTodo(t); setShowModal(true); }}
                onDelete={(id) => setDeleteId(id)}
                onToggleStar={toggleStar}
              />
            ))}
          </div>
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

export default TodayTasks;