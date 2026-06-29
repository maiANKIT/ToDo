import { FiExternalLink, FiStar } from "react-icons/fi";
import "./TodoCard.css";

// ── Hardcoded SVG logos for sites that block favicon APIs ──
const SITE_LOGOS = {
  "leetcode.com": (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z" fill="#FFA116"/>
      <path d="M13.068 22.456c.618 0 1.226-.239 1.685-.702l2.396-2.393c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038" fill="#B3B3B3"/>
    </svg>
  ),
  "geeksforgeeks.org": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116.087l-.223-.08a4.173 4.173 0 0 1-1.104-.695 3.84 3.84 0 0 1-.786-1.032 3.46 3.46 0 0 1 0-2.85 3.84 3.84 0 0 1 .786-1.032c.308-.292.67-.53 1.104-.695l.223-.08a4.51 4.51 0 0 1 3.116.087c.424.167.783.404 1.104.695.231.213.422.465.565.745H24a5.913 5.913 0 0 0-1.97-2.437 6.19 6.19 0 0 0-3.542-1.044 6.193 6.193 0 0 0-3.509 1.044 5.97 5.97 0 0 0-1.98 2.437 5.765 5.765 0 0 0 0 4.61 5.97 5.97 0 0 0 1.98 2.437 6.193 6.193 0 0 0 3.51 1.044 6.19 6.19 0 0 0 3.541-1.044A5.913 5.913 0 0 0 24 14.315h-2.55zM0 14.315h2.55c.143.28.334.532.565.745.321.291.68.528 1.104.695a4.51 4.51 0 0 0 3.116-.087l.223-.08c.434-.165.796-.403 1.104-.695.308-.292.565-.633.786-1.032a3.46 3.46 0 0 0 0-2.85 3.84 3.84 0 0 0-.786-1.032 4.173 4.173 0 0 0-1.104-.695l-.223-.08a4.51 4.51 0 0 0-3.116.087 3.691 3.691 0 0 0-1.104.695 3.01 3.01 0 0 0-.565.745H0a5.913 5.913 0 0 1 1.97-2.437A6.19 6.19 0 0 1 5.512 7.98a6.193 6.193 0 0 1 3.509 1.044 5.97 5.97 0 0 1 1.98 2.437 5.765 5.765 0 0 1 0 4.61 5.97 5.97 0 0 1-1.98 2.437A6.193 6.193 0 0 1 5.513 19.55a6.19 6.19 0 0 1-3.542-1.044A5.913 5.913 0 0 1 0 16.069v-1.754z" fill="#2F8D46"/>
    </svg>
  ),
  "youtube.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
    </svg>
  ),
  "github.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#181717"/>
    </svg>
  ),
  "codeforces.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5V19.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V4.5C9 3.672 9.672 3 10.5 3h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-9c0-.828.672-1.5 1.5-1.5h3z" fill="#1F8ACB"/>
    </svg>
  ),
  "hackerrank.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24C10.714 24 2.25 19.114 1.608 18 .963 16.886.963 7.116 1.608 6 2.25 4.886 10.715 0 12 0zm-.146 7.986h-.707l-3.04 4.284V7.986H6.71v8.028h.734l3.106-4.378v4.378h1.398V7.986h-.094zm3.585 0h-1.398v8.028h1.398v-3.113h.92v3.113h1.398V7.986h-1.398v3.113h-.92V7.986z" fill="#00EA64"/>
    </svg>
  ),
  "codechef.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M11.257.004C5.23.136.137 5.16.004 11.205c-.134 6.046 4.773 11.12 10.819 11.253 6.046.133 11.12-4.773 11.253-10.819C22.21 5.593 17.303.527 11.257.004zm-.53 3.508c1.007-.022 1.979.19 2.86.598L9.54 8.156c-.86-.502-1.443-1.427-1.423-2.492.023-1.104.827-2.04 1.894-2.124.24-.02.479-.027.716-.028zm4.06 1.52c.944.74 1.682 1.76 2.068 2.958L13.7 11.535a3.15 3.15 0 0 1-1.586-2.125l3.671-4.378zm-8.78 3.56 4.155 2.435a3.15 3.15 0 0 1 .062 2.659l-4.155-2.435a3.15 3.15 0 0 1-.062-2.659zm10.695.804a7.51 7.51 0 0 1 .065 3.88l-4.06-2.379c.04-.313.041-.633-.001-.952l3.996-.549zm-5.576 4.006c.487.476.843 1.088 1.013 1.776L7.59 17.606a7.51 7.51 0 0 1-2.244-2.93l5.78-1.274zm2.154 2.777c-.594 1.576-2.024 2.72-3.73 2.84a4.56 4.56 0 0 1-3.282-1.1l7.012-1.74z" fill="#5B4638"/>
    </svg>
  ),
  "stackoverflow.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H17.78v-2.137H6.111v2.137zm.259-4.852 11.45 2.389.451-2.07-11.45-2.389-.451 2.07zm1.359-5.056 10.91 5.095.904-1.949-10.91-5.095-.904 1.949zm2.715-4.785 8.79 8.141 1.42-1.54-8.79-8.141-1.42 1.54zM16.77 0l-1.754 1.28 6.85 9.368 1.754-1.28L16.771 0z" fill="#F58025"/>
    </svg>
  ),
  "npmjs.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" fill="#CB3837"/>
    </svg>
  ),
  "docs.google.com": (
    <svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M14.727 0H3.27C2.033 0 1.03 1.003 1.03 2.239v19.522C1.03 22.997 2.033 24 3.27 24h17.46c1.236 0 2.239-1.003 2.239-2.239V7.513L14.727 0z" fill="#4285F4"/>
      <path d="M14.727 0v7.513h7.242L14.727 0z" fill="#A1C2FA"/>
      <path d="M7.16 13.548h9.68v1.12H7.16zm0 2.8h9.68v1.12H7.16zm0-5.6h9.68v1.12H7.16z" fill="#fff"/>
    </svg>
  ),
};

const TodoCard = ({ todo, onEdit, onDelete, onToggleStar, isListView = false }) => {
  const getStatusClass = () => {
    switch (todo.status) {
      case "done":       return "status-done";
      case "inprogress": return "status-progress";
      default:           return "status-pending";
    }
  };

  const getStatusText = () => {
    switch (todo.status) {
      case "done":       return "Done";
      case "inprogress": return "In Progress";
      default:           return "Pending";
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    let url = todo.link.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleStar?.(todo._id, !todo.star);
  };

  const now = new Date();
  const due = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue  = due && due < now && todo.status !== "done";
  const isDueToday = due && due.toDateString() === now.toDateString() && todo.status !== "done";

  const dueDateLabel = due
    ? isOverdue
      ? `Overdue · ${due.toLocaleDateString()}`
      : isDueToday
      ? "Due today"
      : `Due ${due.toLocaleDateString()}`
    : null;

  const dueDateClass = isOverdue ? "due-overdue" : isDueToday ? "due-today" : "due-upcoming";

  const getDomain = (url) => {
    try {
      return new URL(
        url.trim().match(/^https?:\/\//i) ? url.trim() : "https://" + url.trim()
      ).hostname.replace("www.", "");
    } catch {
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  };

  const SiteLogo = ({ url, size = 14 }) => {
    const domain = getDomain(url);

    // Check hardcoded logos first
    if (SITE_LOGOS[domain]) {
      return <span className="link-favicon-svg">{SITE_LOGOS[domain]}</span>;
    }

    // Fallback to favicon API for unknown sites
    return (
      <img
        src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
        alt={domain}
        className="link-favicon"
        onError={(e) => {
          if (!e.target.dataset.fallback) {
            e.target.dataset.fallback = "1";
            e.target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
          } else {
            e.target.style.display = "none";
            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
          }
        }}
      />
    );
  };

  const StarButton = (
    <button
      className={`star-btn ${todo.star ? "star-btn--active" : ""}`}
      onClick={handleStarClick}
      title={todo.star ? "Unmark important" : "Mark as important"}
    >
      <FiStar size={15} fill={todo.star ? "currentColor" : "none"} />
    </button>
  );

  if (isListView) {
    return (
      <div className="todo-card todo-card--list neu-card">
        <div className="todo-list-left">
          <span className={`status-badge ${getStatusClass()}`}>{getStatusText()}</span>
          {StarButton}
          <h3>{todo.title}</h3>
          {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}
          <span className="todo-date">{new Date(todo.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="todo-list-actions">
          {todo.link && (
            <button className="link-btn" onClick={handleLinkClick} title={getDomain(todo.link)}>
              <SiteLogo url={todo.link} size={14} />
              <span className="link-fallback-icon" style={{ display: "none" }}>
                <FiExternalLink size={14} />
              </span>
            </button>
          )}
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-card neu-card">
      <div className="todo-content">
        <div className="todo-card-top-row">
          <div className={`status-badge ${getStatusClass()}`}>{getStatusText()}</div>
          {StarButton}
        </div>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
        {dueDateLabel && <span className={`due-badge ${dueDateClass}`}>{dueDateLabel}</span>}

        {todo.link && (
          <button className="todo-link-pill" onClick={handleLinkClick}>
            <SiteLogo url={todo.link} size={12} />
            <span className="link-fallback-icon" style={{ display: "none" }}>
              <FiExternalLink size={12} />
            </span>
            <span>{getDomain(todo.link)}</span>
          </button>
        )}
      </div>
      <div className="todo-footer">
        <span className="todo-date">{new Date(todo.createdAt).toLocaleDateString()}</span>
        <div className="todo-actions">
          <button className="edit-btn" onClick={() => onEdit(todo)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;