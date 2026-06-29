import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import "./FilterDropdown.css";

export const SORT_OPTIONS = [
  { value: "newest",  label: "Newest First" },
  { value: "oldest",  label: "Oldest First" },
  { value: "duedate", label: "Due Date (Soonest)" },
  { value: "az",      label: "Title (A-Z)" },
];

export const DUE_OPTIONS = [
  { value: "all",     label: "All Due Dates" },
  { value: "overdue", label: "Overdue" },
  { value: "week",    label: "Due This Week" },
  { value: "nodate",  label: "No Due Date" },
];

const FilterDropdown = ({
  sortBy, setSortBy,
  dueFilter, setDueFilter,
  starredOnly, setStarredOnly,
  showStarredToggle = true,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount =
    (sortBy !== "newest" ? 1 : 0) +
    (dueFilter !== "all" ? 1 : 0) +
    (showStarredToggle && starredOnly ? 1 : 0);

  const handleReset = () => {
    setSortBy("newest");
    setDueFilter("all");
    if (showStarredToggle) setStarredOnly(false);
  };

  return (
    <div className="filter-dropdown-wrap" ref={wrapRef}>
      <button
        className={`filter-btn ${open ? "filter-btn--active" : ""}`}
        onClick={() => setOpen((p) => !p)}
      >
        <SlidersHorizontal size={14} strokeWidth={1.8} />
        <span>Filter</span>
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
      </button>

      {open && (
        <div className="filter-panel">
          <div className="filter-section">
            <span className="filter-section-title">Sort By</span>
            {SORT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`filter-option ${sortBy === opt.value ? "filter-option--active" : ""}`}
                onClick={() => setSortBy(opt.value)}
              >
                <span>{opt.label}</span>
                {sortBy === opt.value && <Check size={14} strokeWidth={2.5} />}
              </div>
            ))}
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-section-title">Due Date</span>
            {DUE_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`filter-option ${dueFilter === opt.value ? "filter-option--active" : ""}`}
                onClick={() => setDueFilter(opt.value)}
              >
                <span>{opt.label}</span>
                {dueFilter === opt.value && <Check size={14} strokeWidth={2.5} />}
              </div>
            ))}
          </div>

          {showStarredToggle && (
            <>
              <div className="filter-divider" />
              <div className="filter-section">
                <div className="filter-toggle-row" onClick={() => setStarredOnly(!starredOnly)}>
                  <span className="filter-section-title" style={{ margin: 0 }}>Starred Only</span>
                  <div className={`filter-switch ${starredOnly ? "filter-switch--on" : ""}`}>
                    <div className="filter-switch-knob" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="filter-divider" />
          <button className="filter-reset-btn" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;