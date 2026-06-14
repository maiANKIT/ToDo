import { useContext } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;