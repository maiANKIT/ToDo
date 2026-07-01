import { useEffect, useRef } from "react";

const LEAD_MINUTES = 10;
const CHECK_INTERVAL_MS = 30 * 1000; // re-check every 30s
const NOTIFIED_KEY = "todoflow-notified-tasks";

const loadNotified = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const saveNotified = (set) => {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore quota errors
  }
};

/**
 * Fires a browser notification once per task when it enters the
 * "due in <= 10 minutes" window. Safe to call on every render — it's a
 * no-op if permission hasn't been granted or Notification isn't supported.
 */
const useDueDateNotifications = (todos) => {
  const notifiedRef = useRef(loadNotified());

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const checkDueDates = () => {
      if (Notification.permission !== "granted") return;

      const now = Date.now();

      todos.forEach((todo) => {
        if (todo.status === "done" || !todo.dueDate) return;

        // Keying on id + current dueDate means editing the due date
        // naturally lets a fresh notification fire later.
        const key = `${todo._id}:${todo.dueDate}`;
        if (notifiedRef.current.has(key)) return;

        const dueTime = new Date(todo.dueDate).getTime();
        const minutesUntilDue = (dueTime - now) / 60000;

        // Only fire inside the lead window, and skip tasks that are
        // already overdue (e.g. tab was closed when it became due) —
        // overdue tasks are already surfaced elsewhere in the UI.
        if (minutesUntilDue <= LEAD_MINUTES && minutesUntilDue >= 0) {
          const rounded = Math.max(0, Math.round(minutesUntilDue));
          const notification = new Notification(`"${todo.title}" is due soon`, {
            body: rounded < 1 ? "Due now" : `Due in ${rounded} minute${rounded === 1 ? "" : "s"}`,
            icon: "/favicon.ico",
            tag: key,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          notifiedRef.current.add(key);
          saveNotified(notifiedRef.current);
        }
      });
    };

    checkDueDates(); // run immediately whenever todos change, then poll
    const interval = setInterval(checkDueDates, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [todos]);

  // Prune stale entries (deleted tasks, completed tasks, changed due dates)
  // so the localStorage set doesn't grow forever.
  useEffect(() => {
    const validKeys = new Set(
      todos.filter((t) => t.dueDate).map((t) => `${t._id}:${t.dueDate}`)
    );
    let changed = false;
    notifiedRef.current.forEach((key) => {
      if (!validKeys.has(key)) {
        notifiedRef.current.delete(key);
        changed = true;
      }
    });
    if (changed) saveNotified(notifiedRef.current);
  }, [todos]);
};

export default useDueDateNotifications;