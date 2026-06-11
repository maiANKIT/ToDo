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

  const [showSearch, setShowSearch] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showScrollTop, setShowScrollTop] =
    useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(
        window.scrollY > 400
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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

  const handleSearchToggle = () => {
    setShowSearch((prev) => {
      if (prev) setSearchTerm("");
      return !prev;
    });
  };

  const filteredTodos = todos
    .filter(
      (todo) =>
        todo.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        todo.description
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

  return (
    <>
      <div
        className={`dashboard-page ${
          showSearch ? "search-open" : ""
        }`}
      >
        <div className="dashboard-container">
          <Navbar
            onSearchClick={
              handleSearchToggle
            }
          />

          {showSearch && (
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                autoFocus
              />
            </div>
          )}

          <div className="hero-card neu-card">
  <h1>My Tasks</h1>

  <p>
    {todos.length} Active Tasks • Stay Productive
  </p>
</div>

          {filteredTodos.length === 0 ? (
            <div className="empty-state neu-card">
              <h2>
                {searchTerm
                  ? "No matching tasks found"
                  : "Ready to Start?"}
              </h2>

              <p>
                {searchTerm
                  ? "Try another search keyword."
                  : "Create your first task and stay productive."}
              </p>
            </div>
          ) : (
            <div className="todo-grid">
              {filteredTodos.map(
                (todo) => (
                  <TodoCard
                    key={todo._id}
                    todo={todo}
                    onEdit={
                      openEditModal
                    }
                    onDelete={(id) =>
                      setDeleteId(id)
                    }
                  />
                )
              )}
            </div>
          )}

          <FloatingButton
            onClick={() => {
              setEditingTodo(null);
              setShowModal(true);
            }}
          />
        </div>
      </div>

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          ↑
        </button>
      )}

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
    </>
  );
};

export default Dashboard;