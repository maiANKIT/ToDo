import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

export default function AuthLogo() {
  return (
    <motion.img
      src={logo}
      alt="TodoFlow"
      className="auth-logo"
      initial={{
        scale: 0.7,
        opacity: 0,
        rotate: -12,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: 0,
        y: [0, -6, 0],
      }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        },
        duration: 0.8,
      }}
    />
  );
}