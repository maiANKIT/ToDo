import { useEffect, useState, useContext, useRef, useCallback } from "react";
import "./Dashboard.css";

import {
  Sun,
  Cloud,
  Moon,
  Flame,
  CheckCircle2,
  ListTodo,
  BarChart2,
  Search,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import TodoModal from "../../components/TodoModal/TodoModal";
import TodoCard from "../../components/TodoCard/TodoCard";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { AuthContext } from "../../context/AuthContext";

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../../services/todoAPI";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingIcon = () => {
  const hour = new Date().getHours();
  if (hour < 12) return <Sun size={32} strokeWidth={1.8} />;
  if (hour < 17) return <Cloud size={32} strokeWidth={1.8} />;
  return <Moon size={32} strokeWidth={1.8} />;
};

const getStreak = (todos) => {
  if (!todos.length) return 0;
  const doneDates = todos
    .filter((t) => t.status === "done" && t.updatedAt)
    .map((t) => new Date(t.updatedAt).toDateString());
  const uniqueDates = [...new Set(doneDates)];
  if (!uniqueDates.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    if (uniqueDates.includes(day.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
};

const getProductivityScore = (todos) => {
  if (!todos.length) return 0;
  const done = todos.filter((t) => t.status === "done").length;
  return Math.round((done / todos.length) * 100);
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name?.split(" ")[0] || "User";

  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [stripSticky, setStripSticky] = useState(false);
  // Tracks actual pixel bottom of navbar for precise sticky positioning
  const [navbarBottom, setNavbarBottom] = useState(108);

  const heroRef   = useRef(null);
  const navbarRef = useRef(null);

  // Measure the navbar's actual bottom edge (top + height)
  const measureNavbar = useCallback(() => {
    if (navbarRef.current) {
      const rect = navbarRef.current.getBoundingClientRect();
      // rect.bottom is relative to viewport, which is what we need for `top` in fixed positioning
      setNavbarBottom(rect.bottom + 8); // 8px gap between navbar and strip
    }
  }, []);

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

  // Measure navbar on mount and on resize
  useEffect(() => {
    measureNavbar();
    window.addEventListener("resize", measureNavbar);
    return () => window.removeEventListener("resize", measureNavbar);
  }, [measureNavbar]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver: go sticky when hero card fully scrolls out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStripSticky(!entry.isIntersecting);
      },
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const addTaskHandler = async (data) => {
    try {
      await createTodo(data);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskHandler = async (id, data) => {
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
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };

  const handleModalSubmit = async (data) => {
    if (editingTodo) {
      await updateTaskHandler(editingTodo._id, data);
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

  const pendingCount    = todos.filter((t) => t.status === "pending").length;
  const inProgressCount = todos.filter((t) => t.status === "inprogress").length;
  const doneCount       = todos.filter((t) => t.status === "done").length;
  const streak          = getStreak(todos);
  const score           = getProductivityScore(todos);

  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || todo.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filterItems = [
    { key: "all",        label: "All",         count: todos.length,    dot: "dot-all"        },
    { key: "pending",    label: "Pending",     count: pendingCount,    dot: "dot-pending"    },
    { key: "inprogress", label: "In Progress", count: inProgressCount, dot: "dot-inprogress" },
    { key: "done",       label: "Done",        count: doneCount,       dot: "dot-done"       },
  ];

  return (
    <>
      <div className={`dashboard-page ${showSearch ? "search-open" : ""}`}>
        <div className="dashboard-container">
          {/* Pass navbarRef so we can measure its exact bottom */}
          <Navbar onSearchClick={handleSearchToggle} navbarRef={navbarRef} />

          {showSearch && (
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* ── Hero ── */}
          <div className="hero-card neu-card" ref={heroRef}>
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
                <ListTodo size={20} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{todos.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <CheckCircle2 size={20} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{doneCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <Flame size={20} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <BarChart2 size={20} strokeWidth={1.8} className="stat-icon" />
                <span className="stat-value">{score}%</span>
                <span className="stat-label">Score</span>
                <div className="score-bar">
                  <div className="score-bar-fill" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Spacer holds layout space when strip goes fixed */}
          {stripSticky && <div className="status-strip-spacer" />}

          {/* ── Status Filter Strip ── */}
          <div
            className={`status-strip${stripSticky ? " status-strip--sticky" : ""}`}
            style={stripSticky ? { top: `${navbarBottom}px` } : {}}
          >
            {filterItems.map(({ key, label, count, dot }) => (
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

          {/* ── Task Grid ── */}
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
            <div className="todo-grid">
              {filteredTodos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onEdit={openEditModal}
                  onDelete={(id) => setDeleteId(id)}
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
          onConfirm={async () => {
            await deleteTaskHandler(deleteId);
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;