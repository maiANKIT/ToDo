import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Flame, Sparkles } from "lucide-react";

import { loginUser } from "../../services/authAPI";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

import "./login.css";

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formAnim = useAnimation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await loginUser(formData);

      login(response.data.token, response.data.user);
      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
      formAnim.start({
        x: [0, -10, 10, -7, 7, -3, 0],
        transition: { duration: 0.45, ease: "easeInOut" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Brand panel ── */}
      <div className="auth-aside">
        <div className="auth-blob auth-blob--a" />
        <div className="auth-blob auth-blob--b" />

        <motion.div
          className="auth-aside__top"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="logo" className="auth-aside__logo" />
          <span>TodoFlow</span>
        </motion.div>

        <motion.div
          className="auth-aside__body"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="auth-badge">
            <Sparkles size={12} strokeWidth={2.5} /> Welcome back
          </span>
          <h2 className="auth-aside__headline">
            Pick up right
            <br />
            where you <span className="auth-grad">left off.</span>
          </h2>
          <p className="auth-aside__sub">
            Your tasks, streaks, and calendar are exactly where you left them.
          </p>
        </motion.div>

        <motion.div
          className="auth-floatcard auth-floatcard--a"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="auth-floatcard__label">Today</span>
          <span className="auth-floatcard__val">14 tasks · 4 done</span>
        </motion.div>

        <motion.div
          className="auth-floatcard auth-floatcard--b"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <Flame size={14} className="auth-flame" />
          <span className="auth-floatcard__val">5-day streak</span>
        </motion.div>
      </div>

      {/* ── Form panel ── */}
      <div className="auth-main">
        <motion.form
          onSubmit={submitHandler}
          className="auth-form"
          animate={formAnim}
          initial="hidden"
          variants={staggerContainer}
        >
          <motion.img
            src={logo}
            alt="logo"
            className="auth-form__logo-mobile"
            variants={fieldVariants}
            animate="show"
            initial="hidden"
          />

          <motion.div className="auth-form__head" variants={fieldVariants} animate="show" initial="hidden">
            <h1>Welcome back</h1>
            <p>Log in to keep your flow going.</p>
          </motion.div>

          <motion.div className="field" variants={fieldVariants} animate="show" initial="hidden">
            <Mail size={17} className="field__icon" />
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={changeHandler}
              required
              autoComplete="email"
            />
            <label>Email</label>
          </motion.div>

          <motion.div className="field" variants={fieldVariants} animate="show" initial="hidden">
            <Lock size={17} className="field__icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={changeHandler}
              required
              autoComplete="current-password"
            />
            <label>Password</label>
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-submit"
            disabled={submitting}
            variants={fieldVariants}
            animate="show"
            initial="hidden"
            whileHover={!submitting ? { y: -2, boxShadow: "0 14px 28px rgba(99,102,241,0.35)" } : {}}
            whileTap={!submitting ? { scale: 0.97 } : {}}
          >
            {submitting ? (
              <Loader2 size={18} className="auth-spin" />
            ) : (
              <>
                Login <ArrowRight size={16} strokeWidth={2.4} />
              </>
            )}
          </motion.button>

          <motion.p className="auth-switch" variants={fieldVariants} animate="show" initial="hidden">
            Don&apos;t have an account?
            <Link to="/signup">Sign Up</Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;