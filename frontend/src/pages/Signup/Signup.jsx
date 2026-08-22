import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  Zap, Sparkles, ShieldCheck, RefreshCw, ChevronLeft,
} from "lucide-react";

import { signupUser, verifyOTP, resendOTP, googleLoginAPI } from "../../services/authAPI";
import { AuthContext } from "../../context/AuthContext";
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

const stepVariants = {
  enter: { opacity: 0, x: 28 },
  center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -28, transition: { duration: 0.22, ease: "easeIn" } },
};

const RESEND_COOLDOWN_SECONDS = 30;

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formAnim = useAnimation();
  const otpRefs = useRef([]);
  const googleWrapRef = useRef(null);
  // The GoogleLogin button renders a fixed-pixel-width iframe, so we track
  // the wrapper's actual width and keep the button sized to fit it.
  const [googleBtnWidth, setGoogleBtnWidth] = useState(380);

  const { user } = useContext(AuthContext);

useEffect(() => {
  if (user) {
    navigate("/dashboard", { replace: true });
  }
}, [user, navigate]);

  // ── Step 1: details ──
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Step 2: OTP ──
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown for the resend button
  useEffect(() => {
    if (cooldown === 0) return;
    const timeout = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  // Focus the first OTP box the moment we land on that step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 350);
    }
  }, [step]);

  // Keep the Google button's width in sync with its wrapper so it never
  // overflows on narrow screens (the library only accepts a fixed px width).
  useEffect(() => {
    const el = googleWrapRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = Math.round(el.getBoundingClientRect().width);
      if (width > 0) setGoogleBtnWidth(width);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shake = () => {
    formAnim.start({
      x: [0, -10, 10, -7, 7, -3, 0],
      transition: { duration: 0.45, ease: "easeInOut" },
    });
  };

  // ── Step 1 submit: request signup -> backend sends OTP ──
  const signupSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signupUser(formData);
      toast.success(`OTP sent to ${formData.email}`);
      setOtp(Array(6).fill(""));
      setStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup Failed");
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 2: verify OTP -> account is actually created here, log straight in ──
  const verifyHandler = async (codeOverride) => {
    const code = (codeOverride || otp.join("")).trim();
    if (code.length !== 6 || verifying) return;

    setVerifying(true);
    try {
      const response = await verifyOTP({ email: formData.email, otp: code });
      login(response.data.token, response.data.user);
      toast.success("Email verified — welcome to TodoFlow!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
      setOtp(Array(6).fill(""));
      otpRefs.current[0]?.focus();
      shake();
    } finally {
      setVerifying(false);
    }
  };

  const otpSubmitHandler = (e) => {
    e.preventDefault();
    verifyHandler();
  };

  const handleOtpChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (digit && index === 5 && next.every((d) => d !== "")) {
      verifyHandler(next.join(""));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();

    const next = pasted.split("");
    while (next.length < 6) next.push("");
    setOtp(next);

    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();

    if (pasted.length === 6) verifyHandler(pasted);
  };

  const resendHandler = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await resendOTP({ email: formData.email });
      toast.success("A new OTP has been sent");
      setOtp(Array(6).fill(""));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      otpRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  // ── Google signup ──
  const googleSuccessHandler = async (credentialResponse) => {
    try {
      const res = await googleLoginAPI(credentialResponse.credential);
      login(res.data.token, res.data.user);
      toast.success("Welcome to TodoFlow!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google sign-up failed");
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
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.form
              key="signup-step-form"
              onSubmit={signupSubmitHandler}
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

              <motion.div className="auth-steps" variants={fieldVariants} animate="show" initial="hidden">
                <span className="auth-step-dot auth-step-dot--active" />
                <span className="auth-step-dot" />
              </motion.div>

              <motion.div className="auth-form__head" variants={fieldVariants} animate="show" initial="hidden">
                <h1>Create account</h1>
                <p>Start organising your tasks today.</p>
              </motion.div>

              <motion.div
                className="auth-google-wrap"
                ref={googleWrapRef}
                variants={fieldVariants}
                animate="show"
                initial="hidden"
              >
                <GoogleLogin
                  onSuccess={googleSuccessHandler}
                  onError={() => toast.error("Google sign-up failed")}
                  theme="outline"
                  shape="pill"
                  size="large"
                  text="signup_with"
                  width={String(googleBtnWidth)}
                />
              </motion.div>

              <motion.div className="auth-divider" variants={fieldVariants} animate="show" initial="hidden">
                <span>or</span>
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
                    Continue <ArrowRight size={16} strokeWidth={2.4} />
                  </>
                )}
              </motion.button>

              <motion.p className="auth-switch" variants={fieldVariants} animate="show" initial="hidden">
                Already have an account?
                <Link to="/login">Login</Link>
              </motion.p>
            </motion.form>
          ) : (
            <motion.form
              key="signup-step-otp"
              onSubmit={otpSubmitHandler}
              className="auth-form"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="auth-steps">
                <span className="auth-step-dot auth-step-dot--done" />
                <span className="auth-step-dot auth-step-dot--active" />
              </div>

              <div className="auth-form__head auth-form__head--otp">
                <span className="auth-otp-icon">
                  <ShieldCheck size={22} strokeWidth={2} />
                </span>
                <h1>Verify your email</h1>
                <p>
                  Enter the 6-digit code sent to <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-box"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={verifying || otp.some((d) => d === "")}
              >
                {verifying ? (
                  <Loader2 size={18} className="auth-spin" />
                ) : (
                  <>
                    Verify &amp; Continue <ArrowRight size={16} strokeWidth={2.4} />
                  </>
                )}
              </button>

              <div className="otp-resend-row">
                <span>Didn&apos;t get the code?</span>
                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={resendHandler}
                  disabled={cooldown > 0 || resending}
                >
                  {resending ? (
                    <RefreshCw size={13} className="auth-spin" />
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>

              <button
                type="button"
                className="otp-back-link"
                onClick={() => setStep("form")}
              >
                <ChevronLeft size={14} /> Use a different email
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;