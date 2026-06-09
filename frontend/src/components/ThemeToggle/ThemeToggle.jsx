import { useContext } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

import { ThemeContext } from "../../context/ThemeContext";

import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  return (
    <button
      className="theme-toggle neu-card"
      onClick={toggleTheme}
    >
      {darkMode ? (
        <FiSun />
      ) : (
        <FiMoon />
      )}
    </button>
  );
};

export default ThemeToggle;