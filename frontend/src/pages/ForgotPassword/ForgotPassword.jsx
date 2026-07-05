import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  KeyRound, ShieldCheck, RefreshCw, ChevronLeft, CheckCircle2,
} from "lucide-react";

import { forgotPassword, verifyResetOTP, resetPassword } from "../../services/authAPI";
import logo from "../../assets/images/logo.png";

import "./ForgotPassword.css";

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
const STEPS = ["email", "otp", "reset"];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formAnim = useAnimation();
  const otpRefs = useRef([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (cooldown === 0) return;
    const timeout = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 350);
    }
  }, [step]);

  const shake = () => {
    formAnim.start({
      x: [0, -10, 10, -7, 7, -3, 0],
      transition: { duration: 0.45, ease: "easeInOut" },
    });
  };

  // ── Step 1: request OTP ──
  const emailSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword({ email });
      toast.success(`OTP sent to ${email}`);
      setOtp(Array(6).fill(""));
      setStep("otp");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't send OTP");
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 2: verify OTP ──
  const verifyHandler = async (codeOverride) => {
    const code = (codeOverride || otp.join("")).trim();
    if (code.length !== 6 || verifying) return;

    setVerifying(true);
    try {
      await verifyResetOTP({ email, otp: code });
      toast.success("OTP verified");
      setStep("reset");
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

    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
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
      await forgotPassword({ email });
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

  // ── Step 3: set new password ──
  const resetSubmitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      shake();
      return;
    }
    setResetting(true);
    try {
      await resetPassword({ email, newPassword, confirmPassword });
      toast.success("Password reset — please log in");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't reset password");
      shake();
    } finally {
      setResetting(false);
    }
  };

  const stepIndex = STEPS.indexOf(step);

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
            <KeyRound size={12} strokeWidth={2.5} /> Account recovery
          </span>
          <h2 className="auth-aside__headline">
            Forgot your
            <br />
            password? <span className="auth-grad">No worries.</span>
          </h2>
          <p className="auth-aside__sub">
            Verify your email with an OTP and set a new password in under a minute.
          </p>
        </motion.div>

        <motion.div
          className="auth-floatcard auth-floatcard--a"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ShieldCheck size={14} className="auth-flame" />
          <span className="auth-floatcard__val">Secure OTP verification</span>
        </motion.div>
      </div>

      {/* ── Form panel ── */}
      <div className="auth-main">
        <AnimatePresence mode="wait">

          {/* Step 1: email */}
          {step === "email" && (
            <motion.form
              key="fp-step-email"
              onSubmit={emailSubmitHandler}
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
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`auth-step-dot ${i === stepIndex ? "auth-step-dot--active" : ""} ${i < stepIndex ? "auth-step-dot--done" : ""}`}
                  />
                ))}
              </motion.div>

              <motion.div className="auth-form__head" variants={fieldVariants} animate="show" initial="hidden">
                <h1>Reset password</h1>
                <p>Enter your account email to get a reset code.</p>
              </motion.div>

              <motion.div className="field" variants={fieldVariants} animate="show" initial="hidden">
                <Mail size={17} className="field__icon" />
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <label>Email</label>
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
                    Send OTP <ArrowRight size={16} strokeWidth={2.4} />
                  </>
                )}
              </motion.button>

              <motion.p className="auth-switch" variants={fieldVariants} animate="show" initial="hidden">
                Remembered it?
                <Link to="/login">Back to login</Link>
              </motion.p>
            </motion.form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <motion.form
              key="fp-step-otp"
              onSubmit={otpSubmitHandler}
              className="auth-form"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="auth-steps">
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`auth-step-dot ${i === stepIndex ? "auth-step-dot--active" : ""} ${i < stepIndex ? "auth-step-dot--done" : ""}`}
                  />
                ))}
              </div>

              <div className="auth-form__head auth-form__head--otp">
                <span className="auth-otp-icon">
                  <ShieldCheck size={22} strokeWidth={2} />
                </span>
                <h1>Enter the code</h1>
                <p>
                  Sent a 6-digit code to <strong>{email}</strong>
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
                    Verify code <ArrowRight size={16} strokeWidth={2.4} />
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

              <button type="button" className="otp-back-link" onClick={() => setStep("email")}>
                <ChevronLeft size={14} /> Use a different email
              </button>
            </motion.form>
          )}

          {/* Step 3: new password */}
          {step === "reset" && (
            <motion.form
              key="fp-step-reset"
              onSubmit={resetSubmitHandler}
              className="auth-form"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="auth-steps">
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`auth-step-dot ${i === stepIndex ? "auth-step-dot--active" : ""} ${i < stepIndex ? "auth-step-dot--done" : ""}`}
                  />
                ))}
              </div>

              <div className="auth-form__head auth-form__head--otp">
                <span className="auth-otp-icon">
                  <CheckCircle2 size={22} strokeWidth={2} />
                </span>
                <h1>Set new password</h1>
                <p>Choose a new password for <strong>{email}</strong></p>
              </div>

              <div className="field">
                <Lock size={17} className="field__icon" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder=" "
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <label>New password</label>
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowNewPassword((s) => !s)}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="field">
                <Lock size={17} className="field__icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <label>Confirm password</label>
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={resetting || !newPassword || !confirmPassword}
              >
                {resetting ? (
                  <Loader2 size={18} className="auth-spin" />
                ) : (
                  <>
                    Reset password <ArrowRight size={16} strokeWidth={2.4} />
                  </>
                )}
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ForgotPassword;