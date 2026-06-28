import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

// All available themes — add more here later if you want
export const THEMES = [
  { id: "light",    label: "Light",    swatch: "#f3f3f3" },
  { id: "dark",     label: "Dark",     swatch: "#111111" },
  { id: "ocean",    label: "Ocean",    swatch: "#0e7490" },
  { id: "sunset",   label: "Sunset",   swatch: "#ea580c" },
  { id: "forest",   label: "Forest",   swatch: "#16803c" },
  { id: "lavender", label: "Lavender", swatch: "#7c3aed" },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("theme");
    return THEMES.some((t) => t.id === saved) ? saved : "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (id) => {
    if (THEMES.some((t) => t.id === id)) setThemeState(id);
  };

  // Kept for backward compatibility with existing ThemeToggle usage
  const darkMode = theme === "dark";
  const toggleTheme = () => setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};