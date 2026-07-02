export const URGENCY = {
  OVERDUE: "overdue",
  TODAY: "today",
  SOON: "soon",   // due within 48h
  WEEK: "week",   // due within 7 days
  LATER: "later", // due beyond 7 days
  NONE: "none",   // no due date, or task is already done
};

/**
 * Classifies a task's due date into an urgency bucket for color-coding.
 * Done tasks and tasks with no due date are always "none" — urgency
 * only matters for things you still need to act on.
 */
export function getUrgencyLevel(dueDate, status) {
  if (!dueDate || status === "done") return URGENCY.NONE;

  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return URGENCY.OVERDUE;
  if (due.toDateString() === now.toDateString()) return URGENCY.TODAY;
  if (diffDays < 2) return URGENCY.SOON;
  if (diffDays < 7) return URGENCY.WEEK;
  return URGENCY.LATER;
}

export function getUrgencyLabel(dueDate, level) {
  const due = new Date(dueDate);
  switch (level) {
    case URGENCY.OVERDUE:
      return `Overdue · ${due.toLocaleDateString()}`;
    case URGENCY.TODAY:
      return "Due today";
    case URGENCY.SOON:
    case URGENCY.WEEK:
    case URGENCY.LATER:
      return `Due ${due.toLocaleDateString()}`;
    default:
      return null;
  }
}