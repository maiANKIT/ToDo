import { useMemo, useState } from "react";
import { Clock3, X } from "lucide-react";
import "./OnThisDay.css";

// How far back to look, in days, and the label to show for each
const LOOKBACKS = [
  { days: 7,   label: "1 week ago" },
  { days: 14,  label: "2 weeks ago" },
  { days: 30,  label: "1 month ago" },
  { days: 90,  label: "3 months ago" },
  { days: 365, label: "1 year ago" },
];

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const todayKey = () => new Date().toISOString().slice(0, 10);
const DISMISS_KEY_PREFIX = "todoflow-onthisday-dismissed-";

const OnThisDay = ({ todos }) => {
  const dismissKey = `${DISMISS_KEY_PREFIX}${todayKey()}`;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(dismissKey) === "true"
  );

  const matches = useMemo(() => {
    const now = new Date();
    const results = [];

    for (const { days, label } of LOOKBACKS) {
      const target = new Date(now);
      target.setDate(target.getDate() - days);

      const tasks = todos.filter(
        (t) => t.status === "done" && t.updatedAt && isSameDay(new Date(t.updatedAt), target)
      );

      if (tasks.length) results.push({ label, tasks });
    }
    return results;
  }, [todos]);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, "true");
    setDismissed(true);
  };

  if (dismissed || matches.length === 0) return null;

  return (
    <div className="on-this-day neu-card">
      <button className="on-this-day-close" onClick={handleDismiss} title="Dismiss">
        <X size={15} />
      </button>

      <div className="on-this-day-header">
        <span className="on-this-day-icon">
          <Clock3 size={17} strokeWidth={1.8} />
        </span>
        <h3>On this day</h3>
      </div>

      <div className="on-this-day-groups">
        {matches.map(({ label, tasks }) => (
          <div key={label} className="on-this-day-group">
            <span className="on-this-day-group-label">{label}</span>
            <div className="on-this-day-tasks">
              {tasks.map((t) => (
                <span key={t._id} className="on-this-day-chip">{t.title}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnThisDay;