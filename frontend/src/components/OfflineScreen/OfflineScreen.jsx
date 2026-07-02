import { useState, useEffect } from "react";
import { WifiOff, RotateCw } from "lucide-react";
import "./OfflineScreen.css";

const OfflineScreen = ({ onRetry }) => {
  const [checking, setChecking] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Gentle pulsing dot animation state, purely cosmetic
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 3), 600);
    return () => clearInterval(id);
  }, []);

  const handleRetry = () => {
    setChecking(true);
    // Give the UI a beat so the retry feels intentional, not instant/fake
    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) onRetry?.();
    }, 700);
  };

  return (
    <div className="offline-screen">
      <div className="offline-card neu-card">
        <div className="offline-icon-wrap">
          <WifiOff size={36} strokeWidth={1.8} />
        </div>

        <h1>You're Offline</h1>
        <p>
          TodoFlow can't reach the internet right now. Check your connection
          and we'll reconnect automatically.
        </p>

        <div className="offline-status-row">
          <span className="offline-dot-group">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`offline-dot ${pulse === i ? "offline-dot--active" : ""}`}
              />
            ))}
          </span>
          <span className="offline-status-text">Waiting for connection…</span>
        </div>

        <button
          className="offline-retry-btn"
          onClick={handleRetry}
          disabled={checking}
        >
          <RotateCw size={15} className={checking ? "offline-spin" : ""} />
          {checking ? "Checking…" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default OfflineScreen;