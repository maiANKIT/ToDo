import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import { getTodos, updateTodo } from "../../services/todoAPI";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import "./Calendar.css";

const VIEWS = ["Month", "Week", "Day"];

const statusIcon = (status) => {
  if (status === "done")       return <CheckCircle2 size={12} strokeWidth={2} className="cal-task-icon cal-task-icon--done" />;
  if (status === "inprogress") return <Clock        size={12} strokeWidth={2} className="cal-task-icon cal-task-icon--progress" />;
  return                              <Circle       size={12} strokeWidth={2} className="cal-task-icon cal-task-icon--pending" />;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

// ── Reference date for placing a task on the calendar:
//    dueDate if set, otherwise fall back to createdAt so nothing disappears ──
const getRefDate = (t) => {
  if (t.dueDate) return new Date(t.dueDate);
  if (t.createdAt) return new Date(t.createdAt);
  return null;
};

const Calendar = () => {
  const [todos,       setTodos]       = useState([]);
  const [view,        setView]        = useState("Month");
  const [current,     setCurrent]     = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [dragOverKey, setDragOverKey] = useState(null);

  const [searchState,  setSearchState]  = useState("closed");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [navbarBottom, setNavbarBottom] = useState(80);
  const navbarRef = useRef(null);

  // ── Tap-to-reschedule (mobile fallback — native drag doesn't work on touch) ──
  const [reschedulingTask, setReschedulingTask] = useState(null);
  const [rescheduleValue,  setRescheduleValue]  = useState("");

  const measureNavbar = useCallback(() => {
    if (navbarRef.current) {
      const r = navbarRef.current.getBoundingClientRect();
      setNavbarBottom(r.bottom + 8);
    }
  }, []);

  useEffect(() => {
    measureNavbar();
    window.addEventListener("resize", measureNavbar);
    return () => window.removeEventListener("resize", measureNavbar);
  }, [measureNavbar]);

  const fetchTodos = () => {
    getTodos().then((r) => setTodos(r.data.data)).catch(console.log);
  };

  useEffect(() => { fetchTodos(); }, []);

  const openSearch = () => {
    setSearchState("opening");
    setTimeout(() => { setSearchState("open"); measureNavbar(); }, 30);
  };

  const closeSearch = () => {
    setSearchState("closing");
    setSearchTerm("");
    setTimeout(() => { setSearchState("closed"); measureNavbar(); }, 320);
  };

  const searchResults = searchTerm.trim()
    ? todos.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const isSearchOpen = searchState === "open" || searchState === "opening" || searchState === "closing";

  const todosForDay = (date) =>
    todos.filter((t) => {
      const ref = getRefDate(t);
      return ref && isSameDay(ref, date);
    });

  const navigate = (dir) => {
    const d = new Date(current);
    if      (view === "Month") d.setMonth(d.getMonth() + dir);
    else if (view === "Week")  d.setDate(d.getDate() + dir * 7);
    else                       d.setDate(d.getDate() + dir);
    setCurrent(d);
  };

  const headerLabel = () => {
    if (view === "Month")
      return current.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (view === "Week") {
      const start = getWeekDays(current)[0];
      const end   = getWeekDays(current)[6];
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return current.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  const getWeekDays = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(d);
      dd.setDate(d.getDate() + i);
      return dd;
    });
  };

  const today = new Date();
  const selectedTodos = todosForDay(selectedDay);

  const statusLabel = (s) =>
    s === "inprogress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1);

  // ── Drag-to-reschedule ──
  // NOTE: using the standard "text/plain" MIME type here instead of a
  // custom one ("text/todo-id"). Some privacy-hardened browsers (Brave,
  // certain Firefox configurations) silently strip custom dataTransfer
  // types, which made drop silently do nothing — "text/plain" is always
  // preserved.
  const handleDragStart = (e, todoId) => {
    e.dataTransfer.setData("text/plain", todoId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverCell = (e, key) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverKey !== key) setDragOverKey(key);
  };

  const handleDragLeaveCell = (key) => {
    setDragOverKey((curr) => (curr === key ? null : curr));
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    setDragOverKey(null);

    const id = e.dataTransfer.getData("text/plain");
    if (!id) {
      console.warn("Drop fired with no task id in dataTransfer — drag may not have started correctly.");
      return;
    }

    const todo = todos.find((t) => t._id === id);
    if (!todo) {
      console.warn("Dropped task id not found in current todos list:", id);
      return;
    }

    const newDate = new Date(date);
    if (todo.dueDate) {
      const old = new Date(todo.dueDate);
      newDate.setHours(old.getHours(), old.getMinutes(), 0, 0);
    } else {
      newDate.setHours(12, 0, 0, 0);
    }

    // If it's already due on the dropped day, there's nothing to change.
    if (todo.dueDate && isSameDay(new Date(todo.dueDate), newDate)) return;

    updateTodo(id, { dueDate: newDate.toISOString() })
      .then(() => {
        toast.success(
          `"${todo.title}" moved to ${newDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        );
        fetchTodos();
      })
      .catch((error) => {
        console.error("Failed to reschedule task:", error?.response?.data || error);
        toast.error(error?.response?.data?.message || "Couldn't reschedule that task");
      });
  };

  // ── Tap-to-reschedule: opens a small date-picker popover. Works on
  //    touch devices where native HTML5 drag-and-drop isn't available. ──
  const openReschedule = (todo) => {
    const ref = todo.dueDate ? new Date(todo.dueDate) : new Date();
    setRescheduleValue(ref.toISOString().slice(0, 10)); // yyyy-mm-dd for <input type="date">
    setReschedulingTask(todo);
  };

  const closeReschedule = () => {
    setReschedulingTask(null);
    setRescheduleValue("");
  };

  const confirmReschedule = () => {
    if (!rescheduleValue || !reschedulingTask) return;
    const todo = reschedulingTask;
    const [y, m, d] = rescheduleValue.split("-").map(Number);
    const newDate = new Date(y, m - 1, d);

    if (todo.dueDate) {
      const old = new Date(todo.dueDate);
      newDate.setHours(old.getHours(), old.getMinutes(), 0, 0);
    } else {
      newDate.setHours(12, 0, 0, 0);
    }

    updateTodo(todo._id, { dueDate: newDate.toISOString() })
      .then(() => {
        toast.success(
          `"${todo.title}" moved to ${newDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        );
        fetchTodos();
        closeReschedule();
      })
      .catch((error) => {
        console.error("Failed to reschedule task:", error?.response?.data || error);
        toast.error(error?.response?.data?.message || "Couldn't reschedule that task");
      });
  };

  return (
    <div className="cal-page">
      <Navbar
        navbarRef={navbarRef}
        searchState={searchState}
        onSearchOpen={openSearch}
        onSearchClose={closeSearch}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="cal-container">

        {/* ── Search Results Overlay ── */}
        {isSearchOpen && searchTerm.trim() && (
          <div className="cal-search-results" style={{ top: `${navbarBottom + 8}px` }}>
            <p className="cal-search-count">
              {searchResults.length} task{searchResults.length !== 1 ? "s" : ""} matching
              <strong> "{searchTerm}"</strong>
            </p>
            {searchResults.length === 0 ? (
              <div className="cal-empty-state">
                <Circle size={32} strokeWidth={1.5} className="cal-empty-icon" />
                <p>No tasks match your search</p>
              </div>
            ) : (
              <div className="cal-search-list">
                {searchResults.map((t, i) => (
                  <div
                    key={i}
                    className={`cal-day__task cal-day__task--${t.status} cal-draggable-task`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t._id)}
                    onClick={() => openReschedule(t)}
                    title="Tap to reschedule"
                  >
                    <div className="cal-day__task-left">
                      {statusIcon(t.status)}
                      <div>
                        <p className="cal-day__task-title">{t.title}</p>
                        {t.description && <p className="cal-day__task-desc">{t.description}</p>}
                        {t.createdAt && (
                          <p className="cal-day__task-date">
                            {new Date(t.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`cal-badge cal-badge--${t.status}`}>
                      {statusLabel(t.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Calendar Header ── */}
        <div className="cal-header neu-card">
          <div className="cal-header__left">
            <h1 className="cal-title">Calendar</h1>
            <p className="cal-sub">View your tasks by date · drag a task onto a day to reschedule</p>
          </div>
          <div className="cal-header__right">
            <div className="cal-view-switch">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  className={`cal-view-btn ${view === v ? "cal-view-btn--active" : ""}`}
                  onClick={() => setView(v)}
                >{v}</button>
              ))}
            </div>
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={() => navigate(-1)}>
                <FiChevronLeft size={18} />
              </button>
              <span className="cal-nav-label">{headerLabel()}</span>
              <button className="cal-nav-btn" onClick={() => navigate(1)}>
                <FiChevronRight size={18} />
              </button>
            </div>
            <button
              className="cal-today-btn"
              onClick={() => { setCurrent(new Date()); setSelectedDay(new Date()); }}
            >Today</button>
          </div>
        </div>

        <div className="cal-body">

          {/* ── Month View ── */}
          {view === "Month" && (
            <div className="cal-month neu-card">
              <div className="cal-month__weekdays">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="cal-weekday">{d}</div>
                ))}
              </div>
              <div className="cal-month__grid">
                {getMonthDays(current).map((date, i) => {
                  if (!date) return <div key={`e-${i}`} className="cal-cell cal-cell--empty" />;
                  const dayTodos  = todosForDay(date);
                  const isToday   = isSameDay(date, today);
                  const isSel     = isSameDay(date, selectedDay);
                  const key       = date.toDateString();
                  const isOver    = dragOverKey === key;
                  return (
                    <div
                      key={i}
                      className={`cal-cell ${isToday ? "cal-cell--today" : ""} ${isSel ? "cal-cell--selected" : ""} ${isOver ? "cal-cell--dragover" : ""}`}
                      onClick={() => setSelectedDay(date)}
                      onDragOver={(e) => handleDragOverCell(e, key)}
                      onDragLeave={() => handleDragLeaveCell(key)}
                      onDrop={(e) => handleDrop(e, date)}
                    >
                      <span className="cal-cell__num">{date.getDate()}</span>
                      <div className="cal-cell__dots">
                        {dayTodos.slice(0,3).map((t, j) => (
                          <span key={j} className={`cal-dot cal-dot--${t.status}`} />
                        ))}
                        {dayTodos.length > 3 && (
                          <span className="cal-dot-more">+{dayTodos.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Week View ── */}
          {view === "Week" && (
            <div className="cal-week neu-card">
              {getWeekDays(current).map((date, i) => {
                const dayTodos = todosForDay(date);
                const isToday  = isSameDay(date, today);
                const isSel    = isSameDay(date, selectedDay);
                const key      = date.toDateString();
                const isOver   = dragOverKey === key;
                return (
                  <div
                    key={i}
                    className={`cal-week__col ${isToday ? "cal-week__col--today" : ""} ${isSel ? "cal-week__col--selected" : ""} ${isOver ? "cal-week__col--dragover" : ""}`}
                    onClick={() => setSelectedDay(date)}
                    onDragOver={(e) => handleDragOverCell(e, key)}
                    onDragLeave={() => handleDragLeaveCell(key)}
                    onDrop={(e) => handleDrop(e, date)}
                  >
                    <div className="cal-week__header">
                      <span className="cal-week__day">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className={`cal-week__num ${isToday ? "cal-week__num--today" : ""}`}>
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="cal-week__tasks">
                      {dayTodos.length === 0 ? (
                        <div className="cal-week__empty">—</div>
                      ) : (
                        dayTodos.map((t, j) => (
                          <div
                            key={j}
                            className={`cal-week__task cal-week__task--${t.status} cal-draggable-task`}
                            draggable
                            onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, t._id); }}
                            onClick={(e) => { e.stopPropagation(); openReschedule(t); }}
                            title="Tap to reschedule"
                          >
                            {statusIcon(t.status)}
                            <span>{t.title}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Day View ── */}
          {view === "Day" && (
            <div className="cal-day neu-card">
              <div className="cal-day__header">
                <span className={`cal-day__num ${isSameDay(current, today) ? "cal-day__num--today" : ""}`}>
                  {current.getDate()}
                </span>
                <span className="cal-day__label">
                  {current.toLocaleDateString("en-US", { weekday: "long", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="cal-day__tasks">
                {todosForDay(current).length === 0 ? (
                  <div className="cal-empty-state">
                    <Circle size={36} strokeWidth={1.5} className="cal-empty-icon" />
                    <p>No tasks on this day</p>
                  </div>
                ) : (
                  todosForDay(current).map((t, i) => (
                    <div
                      key={i}
                      className={`cal-day__task cal-day__task--${t.status} cal-draggable-task`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t._id)}
                      onClick={() => openReschedule(t)}
                      title="Tap to reschedule"
                    >
                      <div className="cal-day__task-left">
                        {statusIcon(t.status)}
                        <div>
                          <p className="cal-day__task-title">{t.title}</p>
                          {t.description && <p className="cal-day__task-desc">{t.description}</p>}
                        </div>
                      </div>
                      <span className={`cal-badge cal-badge--${t.status}`}>
                        {statusLabel(t.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Selected Day Panel (Month & Week) ── */}
          {view !== "Day" && (
            <div
              className="cal-selected-panel neu-card"
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
              onDrop={(e) => handleDrop(e, selectedDay)}
            >
              <h3 className="cal-panel-title">
                {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              {selectedTodos.length === 0 ? (
                <div className="cal-empty-state">
                  <Circle size={32} strokeWidth={1.5} className="cal-empty-icon" />
                  <p>No tasks on this day</p>
                </div>
              ) : (
                <div className="cal-panel-tasks">
                  {selectedTodos.map((t, i) => (
                    <div
                      key={i}
                      className={`cal-day__task cal-day__task--${t.status} cal-draggable-task`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t._id)}
                      onClick={() => openReschedule(t)}
                      title="Tap to reschedule"
                    >
                      <div className="cal-day__task-left">
                        {statusIcon(t.status)}
                        <div>
                          <p className="cal-day__task-title">{t.title}</p>
                          {t.description && <p className="cal-day__task-desc">{t.description}</p>}
                        </div>
                      </div>
                      <span className={`cal-badge cal-badge--${t.status}`}>
                        {statusLabel(t.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Tap-to-reschedule popover ── */}
      {reschedulingTask && (
        <div className="cal-reschedule-overlay" onClick={closeReschedule}>
          <div className="cal-reschedule-box" onClick={(e) => e.stopPropagation()}>
            <h4 className="cal-reschedule-heading">Reschedule task</h4>
            <p className="cal-reschedule-task-title">{reschedulingTask.title}</p>
            <input
              type="date"
              className="cal-reschedule-input"
              value={rescheduleValue}
              onChange={(e) => setRescheduleValue(e.target.value)}
              autoFocus
            />
            <div className="cal-reschedule-actions">
              <button className="cal-reschedule-cancel" onClick={closeReschedule}>
                Cancel
              </button>
              <button
                className="cal-reschedule-save"
                onClick={confirmReschedule}
                disabled={!rescheduleValue}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;