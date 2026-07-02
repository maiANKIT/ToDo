import { useEffect, useRef, useState } from "react";

const IDLE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes of inactivity

const useIdleNudge = (pendingCount) => {
  const lastActivityRef = useRef(Date.now());
  const nudgedRef = useRef(false);
  const [nudgeActive, setNudgeActive] = useState(false);

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
      nudgedRef.current = false;
      setNudgeActive(false);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const interval = setInterval(() => {
      const idleFor = Date.now() - lastActivityRef.current;
      if (idleFor >= IDLE_THRESHOLD_MS && !nudgedRef.current && pendingCount > 0) {
        nudgedRef.current = true;
        setNudgeActive(true);
      }
    }, 15000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive));
      clearInterval(interval);
    };
  }, [pendingCount]);

  const dismissNudge = () => setNudgeActive(false);

  return { nudgeActive, dismissNudge };
};

export default useIdleNudge;