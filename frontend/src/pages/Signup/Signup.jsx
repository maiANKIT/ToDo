import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Zap, Sparkles } from "lucide-react";

import { signupUser } from "../../services/authAPI";
import logo from "../../assets/images/logo.png";

import "./Signup.css";

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const Signup = () => {
  const navigate = useNavigate();
  const formAnim = useAnimation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signupUser(formData);
      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup Failed");
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
            <Sparkles size={12} strokeWidth={2.5} /> Free forever
          </span>
          <h2 className="auth-aside__headline">
            Your tasks,
            <br />
            finally <span className="auth-grad">in order.</span>
          </h2>
          <p className="auth-aside__sub">
            Grid, list, and calendar views with streaks built in. Set up in under a minute.
          </p>
        </motion.div>

        <motion.div
          className="auth-floatcard auth-floatcard--a"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Zap size={14} className="auth-flame" />
          <span className="auth-floatcard__val">3 view modes</span>
        </motion.div>

        <motion.div
          className="auth-floatcard auth-floatcard--b"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <span className="auth-floatcard__label">Always</span>
          <span className="auth-floatcard__val">100% free to use</span>
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
            <h1>Create account</h1>
            <p>Start organising your tasks today.</p>
          </motion.div>

          <motion.div className="field" variants={fieldVariants} animate="show" initial="hidden">
            <User size={17} className="field__icon" />
            <input
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={changeHandler}
              required
              autoComplete="name"
            />
            <label>Name</label>
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
              autoComplete="new-password"
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
                Create account <ArrowRight size={16} strokeWidth={2.4} />
              </>
            )}
          </motion.button>

          <motion.p className="auth-switch" variants={fieldVariants} animate="show" initial="hidden">
            Already have an account?
            <Link to="/login">Login</Link>
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;