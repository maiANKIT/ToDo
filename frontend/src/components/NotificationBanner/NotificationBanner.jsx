import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import "./NotificationBanner.css";

const DISMISS_KEY = "todoflow-notif-banner-dismissed";

// Once a user clicks "Block" in the native prompt, calling
// requestPermission() again returns "denied" silently — the browser
// will never show the native dialog again. The only fix is the user
// flipping it back on in their browser's own site settings, so once we
// detect "denied" we switch to showing them how, instead of a dead button.
const getSettingsHint = () => {
  const ua = navigator.userAgent;
  if (/Firefox/i.test(ua)) {
    return 'Click the lock icon in the address bar → "Connection secure" → Permissions.';
  }
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    return "Safari menu → Settings → Websites → Notifications.";
  }
  return "Click the icon left of the address bar → Site settings → Notifications.";
};

const NotificationBanner = () => {
  const [permission, setPermission] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const supported = typeof window !== "undefined" && "Notification" in window;

  useEffect(() => {
    if (!supported) return;
    setPermission(Notification.permission);
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");

    // If the user changes the permission in the browser's own settings
    // while this tab is open, catch it on next focus instead of requiring
    // a full page reload.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setPermission(Notification.permission);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [supported]);

  const handleEnable = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      // Job done — no need to keep tracking dismissal.
      localStorage.setItem(DISMISS_KEY, "true");
      setDismissed(true);
    }
    // If denied, leave the banner up so it can switch to the
    // "here's how to fix it" message instead of just disappearing.
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  if (!supported || permission === "granted" || dismissed) return null;
  if (permission !== "default" && permission !== "denied") return null;

  const isDenied = permission === "denied";

  return (
    <div className="notif-banner neu-card">
      <div className="notif-banner-left">
        <span className={`notif-banner-icon ${isDenied ? "notif-banner-icon--denied" : ""}`}>
          {isDenied ? <BellOff size={18} strokeWidth={1.8} /> : <Bell size={18} strokeWidth={1.8} />}
        </span>
        <span className="notif-banner-text">
          {isDenied
            ? <>Notifications are blocked. {getSettingsHint()}</>
            : "Get a reminder 10 minutes before a task is due."}
        </span>
      </div>
      <div className="notif-banner-actions">
        {!isDenied && (
          <button className="notif-banner-enable" onClick={handleEnable}>
            Enable
          </button>
        )}
        <button className="notif-banner-close" onClick={handleDismiss} title="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;