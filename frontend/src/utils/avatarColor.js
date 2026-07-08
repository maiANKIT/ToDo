const PALETTE = [
  "#667eea", "#f59e0b", "#10b981",
  "#ec4899", "#0e7490", "#7c3aed", "#ea580c",
];

export const colorFromName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

export default colorFromName;