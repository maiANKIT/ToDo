import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Menu, X } from "lucide-react";

import ThemeToggle from "../../../components/ThemeToggle/ThemeToggle";
import logo from "../../../assets/images/logo.png";

export default function Navbar({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

const isLoggedIn = !!user;

  return (
    <header
      className={`landing-navbar ${
        scrolled ? "landing-navbar--scrolled" : ""
      }`}
    >
      <div className="container navbar-wrapper">

        {/* Logo */}

        <Link to="/" className="logo-section">
          <img src={logo} alt="TodoFlow" />
          <span>TodoFlow</span>
        </Link>

        {/* Desktop Menu */}

        <nav className="desktop-nav">
          <a href="#features">Features</a>
          <a href="#workspace">Workspace</a>
          <a href="#analytics">Analytics</a>
          <a href="#faq">FAQ</a>
        </nav>

        {/* Right */}

        <div className="navbar-actions">

          <ThemeToggle />

          {isLoggedIn ? (
  <>
    <button
      className="login-btn"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </button>

    <button
      className="primary-btn"
      onClick={logout}
    >
      Logout
    </button>
  </>
) : (
  <>
    <button
      className="login-btn"
      onClick={() => navigate("/login")}
    >
      Login
    </button>

    <button
      className="primary-btn"
      onClick={() => navigate("/signup")}
    >
      Get Started
    </button>
  </>
)}

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>

      {/* Mobile */}

      <div
        className={`mobile-menu ${
          mobileMenuOpen
            ? "mobile-menu--open"
            : ""
        }`}
      >
        <a href="#features">Features</a>
        <a href="#workspace">Workspace</a>
        <a href="#analytics">Analytics</a>
        <a href="#faq">FAQ</a>

        {isLoggedIn ? (
  <>
    <button
      className="mobile-primary-btn"
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </button>

    <button
      className="mobile-primary-btn"
      onClick={logout}
    >
      Logout
    </button>
  </>
) : (
  <button
    className="mobile-primary-btn"
    onClick={() => navigate("/signup")}
  >
    Get Started
  </button>
)}
      </div>
    </header>
  );
}