import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const goHome = () => navigate(user ? "/dashboard" : "/");

  return (
    <div className="notfound-page">
      <div className="notfound-blob notfound-blob--a" />
      <div className="notfound-blob notfound-blob--b" />

      <div className="notfound-content">
        <div className="notfound-logo-row">
          <img src={logo} alt="logo" className="notfound-logo" />
          <span>TodoFlow</span>
        </div>

        <div className="notfound-icon">
          <Compass size={36} strokeWidth={1.6} />
        </div>

        <h1 className="notfound-code">
          4<span className="notfound-grad">0</span>4
        </h1>

        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-sub">
          The page you're looking for doesn't exist, moved, or the URL's a bit off.
        </p>

        <div className="notfound-actions">
          <button className="notfound-btn-secondary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} strokeWidth={2.2} />
            Go back
          </button>
          <button className="notfound-btn-primary" onClick={goHome}>
            {user ? "Back to Dashboard" : "Back to Home"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;