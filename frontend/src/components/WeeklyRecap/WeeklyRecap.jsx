import { useState, useEffect, useMemo } from "react";
import { TrendingUp, X, Sparkles } from "lucide-react";
import "./WeeklyRecap.css";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Monday 00:00:00 of the week containing `d`
const getWeekStart = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sun ... 6 = Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const weekKeyFor = (weekStart) =>
  `todoflow-recap-dismissed-${weekStart.toISOString().slice(0, 10)}`;

const WeeklyRecap = ({ todos }) => {
  const weekStart = useMemo(() => getWeekStart(), []);
  const dismissKey = weekKeyFor(weekStart);

  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(dismissKey) === "true"
  );

  useEffect(() => {
    setDismissed(localStorage.getItem(dismissKey) === "true");
  }, [dismissKey]);

  const stats = useMemo(() => {
    const completedThisWeek = todos.filter(
      (t) => t.status === "done" && t.updatedAt && new Date(t.updatedAt) >= weekStart
    );
    const createdThisWeek = todos.filter(
      (t) => t.createdAt && new Date(t.createdAt) >= weekStart
    );

    const byDay = {};
    completedThisWeek.forEach((t) => {
      const day = DAY_NAMES[new Date(t.updatedAt).getDay()];
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const busiestEntry = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];

    return {
      completedCount: completedThisWeek.length,
      createdCount: createdThisWeek.length,
      busiestDay: busiestEntry ? busiestEntry[0] : null,
      busiestCount: busiestEntry ? busiestEntry[1] : 0,
    };
  }, [todos, weekStart]);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, "true");
    setDismissed(true);
  };

  // Nothing worth showing yet this week — don't clutter the dashboard.
  if (dismissed || (stats.completedCount === 0 && stats.createdCount === 0)) return null;

  return (
    <div className="weekly-recap neu-card">
      <button className="weekly-recap-close" onClick={handleDismiss} title="Dismiss">
        <X size={15} />
      </button>

      <div className="weekly-recap-header">
        <span className="weekly-recap-icon">
          <Sparkles size={17} strokeWidth={1.8} />
        </span>
        <h3>This week so far</h3>
      </div>

      <div className="weekly-recap-stats">
        <div className="weekly-recap-stat">
          <span className="weekly-recap-value">{stats.completedCount}</span>
          <span className="weekly-recap-label">Completed</span>
        </div>
        <div className="weekly-recap-stat">
          <span className="weekly-recap-value">{stats.createdCount}</span>
          <span className="weekly-recap-label">Created</span>
        </div>
        {stats.busiestDay && (
          <div className="weekly-recap-stat weekly-recap-stat--busiest">
            <span className="weekly-recap-value">
              <TrendingUp size={15} strokeWidth={2} />
              {stats.busiestDay}
            </span>
            <span className="weekly-recap-label">Busiest day</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyRecap;