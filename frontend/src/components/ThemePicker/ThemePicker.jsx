import { useContext } from "react";
import { ThemeContext, THEMES } from "../../context/ThemeContext";
import "./ThemePicker.css";

const ThemePicker = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="theme-picker">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-swatch-btn ${theme === t.id ? "theme-swatch-btn--active" : ""}`}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
        >
          <span
            className="theme-swatch-circle"
            style={{ background: t.swatch }}
          />
          <span className="theme-swatch-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemePicker;