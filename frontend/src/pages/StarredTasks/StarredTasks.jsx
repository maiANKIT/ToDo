import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/TodoCard/TodoCard";
import TodoModal from "../../components/TodoModal/TodoModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { getTodos, updateTodo, deleteTodo } from "../../services/todoAPI";
import "../TodayTasks/TodayTasks.css";

const StarredTasks = () => {
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

  const starredTasks = todos.filter((t) => t.star);

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
          <div className="todo-grid">
            {starredTasks.map((todo) => (
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

export default StarredTasks;