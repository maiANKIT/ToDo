import { motion } from "framer-motion";
import AuthBackground from "./AuthBackground";
import "./auth.css";

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="auth-container">
      <AuthBackground />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="glass-card"
      >
        <div className="glass-top" />

        <h1>{title}</h1>

        <p>{subtitle}</p>

        {children}
      </motion.div>
    </div>
  );
}