import { useState, useCallback } from "react";

/**
 * useCelebration
 *
 * Returns:
 *   celebrate()  — call this when the last subtask is ticked off
 *   dismiss()    — call this to close the overlay early
 *   active       — boolean, true while the overlay is visible
 *
 * Usage:
 *   const { celebrate, dismiss, active } = useCelebration();
 *
 *   // inside your subtask toggle handler:
 *   const updatedSubtasks = subtasks.map(s =>
 *     s.id === id ? { ...s, done: true } : s
 *   );
 *   setSubtasks(updatedSubtasks);
 *   if (updatedSubtasks.every(s => s.done)) celebrate();
 *
 *   // in JSX:
 *   <CelebrationOverlay active={active} onDismiss={dismiss} />
 */
export function useCelebration() {
  const [active, setActive] = useState(false);

  const celebrate = useCallback(() => {
    setActive(true);
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
  }, []);

  return { active, celebrate, dismiss };
}