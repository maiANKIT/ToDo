export const STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Completed",
};

export const STATUS_KEYS = {
  pending: STATUS.PENDING,
  inprogress: STATUS.IN_PROGRESS,
  done: STATUS.DONE,
};

export const STATUS_CYCLE = [STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.DONE];

export const STATUS_LABELS = {
  [STATUS.PENDING]: "Pending",
  [STATUS.IN_PROGRESS]: "In Progress",
  [STATUS.DONE]: "Completed",
};

export const getStatusKey = (status) => {
  if (status === STATUS.IN_PROGRESS) return "inprogress";
  if (status === STATUS.DONE) return "done";
  return "pending";
};

export const getNextStatus = (status) => {
  const idx = STATUS_CYCLE.indexOf(status);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
};

export const PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const PRIORITY_ORDER = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL];

export const PRIORITY_META = {
  [PRIORITY.LOW]:      { label: "Low",      className: "priority-low"      },
  [PRIORITY.MEDIUM]:   { label: "Medium",   className: "priority-medium"   },
  [PRIORITY.HIGH]:     { label: "High",     className: "priority-high"     },
  [PRIORITY.CRITICAL]: { label: "Critical", className: "priority-critical" },
};

export const getNextPriority = (priority) => {
  const idx = PRIORITY_ORDER.indexOf(priority);
  return PRIORITY_ORDER[(idx + 1) % PRIORITY_ORDER.length];
};