import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("todoflow-sidebar-collapsed") === "true"
  );

  useEffect(() => {
    localStorage.setItem("todoflow-sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    <div
      className="app-layout"
      style={{ "--sidebar-w": collapsed ? "76px" : "260px" }}
    >
      {!mobileOpen && (
        <button
          className="app-layout-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu size={18} />
        </button>
      )}

      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      {mobileOpen && (
        <div className="app-layout-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <div className="app-layout-content">{children}</div>
    </div>
  );
};

export default AppLayout;