import { useEffect } from "react";

const useKeyboardShortcuts = ({ onNew, onSearch, onEscape }) => {
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;

      if (e.key === "Escape") {
        onEscape?.();
        return;
      }

      if (isTyping) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        onNew?.();
      } else if (e.key === "/") {
        e.preventDefault();
        onSearch?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNew, onSearch, onEscape]);
};

export default useKeyboardShortcuts;