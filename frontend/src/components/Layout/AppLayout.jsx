import { useContext, useState, useEffect } from "react"

import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("todoflow-sidebar-collapsed") === "true"
  );

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("todoflow-sidebar-collapsed", collapsed);
  }, [collapsed]);

  // ==========================================
  // AUTOMATIC LOGOUT LOGIC (Background Polling)
  // ==========================================
  useEffect(() => {
    const checkSession = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // already logged out, nothing to check

        // Same port (3000) as the rest of the app's API calls
        await axios.get("http://localhost:3000/api/v1/user/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Session expired or logged in from another device. Auto logging out...");

          clearInterval(checkSession);

          // Reuse AuthContext's logout so state + localStorage + redirect
          // all stay consistent with manual logout
          logout();
        }
      }
    }, 10000); // check every 10s — bump to 15000/30000 if you want less network chatter

    return () => clearInterval(checkSession);
  }, [navigate, logout]);

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