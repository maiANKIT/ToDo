import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import "./DateTimePicker.css";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const POPOVER_HEIGHT = 430;
const POPOVER_WIDTH = 300;

const pad = (n) => String(n).padStart(2, "0");

const formatDisplay = (date) => {
  if (!date) return "";
  const day = date.getDate();
  const month = MONTHS[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${day} ${month} ${year}, ${h}:${pad(m)} ${ampm}`;
};

const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false, month: month - 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, month });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const nextDay = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({ day: nextDay, current: false, month: month + 1 });
  }
  return cells;
};

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

/* ── Custom dropdown for hour/minute — replaces native <select> ── */
const TimeDropdown = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dtp-time-dropdown-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`dtp-time-select ${open ? "dtp-time-select--open" : ""}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span>{pad(value)}</span>
        <FiChevronDown size={13} className={`dtp-time-arrow ${open ? "rotated" : ""}`} />
      </button>

      {open && (
        <div className="dtp-time-options">
          {options.map((opt) => (
            <div
              key={opt}
              className={`dtp-time-option ${value === opt ? "dtp-time-option--selected" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {pad(opt)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DateTimePicker = ({ value, onChange, placeholder = "Due date (optional)" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [hour, setHour] = useState(value ? initial.getHours() : 9);
  const [minute, setMinute] = useState(value ? initial.getMinutes() : 0);

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const selectedDate = value ? new Date(value) : null;
  const today = new Date();

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const calcPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top;
    if (spaceBelow >= POPOVER_HEIGHT || spaceBelow >= spaceAbove) {
      top = rect.bottom + 8;
    } else {
      top = rect.top - POPOVER_HEIGHT - 8;
    }

    if (top < 8) top = 8;

    let left = rect.left;
    if (left + POPOVER_WIDTH > window.innerWidth - 8) {
      left = window.innerWidth - POPOVER_WIDTH - 8;
    }

    setPos({ top, left, width: rect.width });
  };

  useEffect(() => {
    if (!isOpen) return;
    const recalc = () => calcPosition();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [isOpen]);

  const openPicker = () => {
    calcPosition();
    setIsOpen(true);
  };

  const commit = (dateObj) => {
    const result = new Date(dateObj);
    result.setHours(hour, minute, 0, 0);
    onChange(result.toISOString());
  };

  const handleDayClick = (cell) => {
    const newDate = new Date(viewYear, cell.month, cell.day);
    if (!cell.current) {
      setViewYear(newDate.getFullYear());
      setViewMonth(newDate.getMonth());
    }
    commit(newDate);
  };

  const handleHourChange = (h) => {
    setHour(h);
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setHours(h, minute, 0, 0);
      onChange(d.toISOString());
    }
  };

  const handleMinuteChange = (m) => {
    setMinute(m);
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setHours(hour, m, 0, 0);
      onChange(d.toISOString());
    }
  };

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setHour(today.getHours());
    setMinute(today.getMinutes());
    commit(today);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const cells = buildMonthGrid(viewYear, viewMonth);
  const isSameDay = (cell) => {
    if (!selectedDate) return false;
    return (
      cell.current &&
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === cell.day
    );
  };
  const isToday = (cell) =>
    cell.current &&
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === cell.day;

  return (
    <>
      <div
        ref={triggerRef}
        className="dtp-trigger"
        onClick={openPicker}
      >
        <span className="dtp-trigger-icon"><FiCalendar size={15} /></span>
        <span className={`dtp-trigger-text ${!value ? "dtp-trigger-text--placeholder" : ""}`}>
          {value ? formatDisplay(selectedDate) : placeholder}
        </span>
        {value && (
          <button
            type="button"
            className="dtp-clear-btn"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            title="Clear"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          className="dtp-popover"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="dtp-header">
            <button type="button" className="dtp-nav-btn" onClick={goPrevMonth}>
              <FiChevronLeft size={16} />
            </button>
            <span className="dtp-month-label">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="dtp-nav-btn" onClick={goNextMonth}>
              <FiChevronRight size={16} />
            </button>
          </div>

          <div className="dtp-weekdays">
            {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
          </div>

          <div className="dtp-grid">
            {cells.map((cell, i) => (
              <button
                type="button"
                key={i}
                className={[
                  "dtp-day",
                  !cell.current ? "dtp-day--muted" : "",
                  isSameDay(cell) ? "dtp-day--selected" : "",
                  isToday(cell) && !isSameDay(cell) ? "dtp-day--today" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => handleDayClick(cell)}
              >
                {cell.day}
              </button>
            ))}
          </div>

          <div className="dtp-time-row">
            <span className="dtp-time-label">Time</span>
            <TimeDropdown value={hour} options={HOURS} onChange={handleHourChange} />
            <span className="dtp-time-colon">:</span>
            <TimeDropdown value={minute} options={MINUTES} onChange={handleMinuteChange} />
          </div>

          <div className="dtp-footer">
            <button type="button" className="dtp-footer-link" onClick={handleClear}>Clear</button>
            <button type="button" className="dtp-footer-link" onClick={handleToday}>Today</button>
            <button type="button" className="dtp-footer-done" onClick={() => setIsOpen(false)}>Done</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DateTimePicker;