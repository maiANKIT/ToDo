import { useEffect, useState } from "react";

import "./Dashboard.css";

import Navbar from "../../components/Navbar/Navbar";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import TodoModal from "../../components/TodoModal/TodoModal";
import TodoCard from "../../components/TodoCard/TodoCard";
import DeleteModal from "../../components/DeleteModal/DeleteModal";

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../../services/todoAPI";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] =
    useState(false);

  const [editingTodo, setEditingTodo] =
    useState(null);

  const [deleteId, setDeleteId] =
    useState(null);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();

      setTodos(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTaskHandler = async (data) => {
    try {
      await createTodo(data);

      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskHandler = async (
    id,
    data
  ) => {
    try {
      await updateTodo(id, data);

      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTaskHandler = async (id) => {
    try {
      await deleteTodo(id);

      setTodos((prev) =>
        prev.filter(
          (todo) => todo._id !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };

  const handleModalSubmit = async (
    data
  ) => {
    if (editingTodo) {
      await updateTaskHandler(
        editingTodo._id,
        data
      );
    } else {
      await addTaskHandler(data);
    }

    setEditingTodo(null);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <Navbar />

        <div className="hero-card neu-card">
          <h1>My Tasks</h1>

          <p>
            Manage your daily tasks with a
            clean black & white interface.
          </p>
        </div>

        {todos.length === 0 ? (
          <div className="empty-state neu-card">
            <h2>Ready to Start?</h2>

            <p>
              Create your first task and
              stay productive.
            </p>
          </div>
        ) : (
          <div className="todo-grid">
            {todos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onEdit={openEditModal}
                onDelete={(id) =>
                  setDeleteId(id)
                }
              />
            ))}
          </div>
        )}

        <FloatingButton
          onClick={() => {
            setEditingTodo(null);
            setShowModal(true);
          }}
        />

        {showModal && (
          <TodoModal
            editTodo={editingTodo}
            onClose={() =>
              setShowModal(false)
            }
            onSubmit={
              handleModalSubmit
            }
          />
        )}

        {deleteId && (
          <DeleteModal
            onClose={() =>
              setDeleteId(null)
            }
            onConfirm={async () => {
              await deleteTaskHandler(
                deleteId
              );

              setDeleteId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;