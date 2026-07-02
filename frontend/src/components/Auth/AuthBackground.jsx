import { motion } from "framer-motion";
import FloatingParticles from "./FloatingParticles";
import Spotlight from "./Spotlight";

export default function AuthBackground() {
  return (
    <>
      <Spotlight />

      <div className="auth-bg">

        {/* Animated Grid */}
        <div className="grid-bg" />

        {/* Noise */}
        <div className="noise" />

        {/* Aurora */}
        <motion.div
          className="aurora aurora-1"
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -80, 70, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="aurora aurora-2"
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 70, -60, 0],
            scale: [1, 0.85, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="aurora aurora-3"
          animate={{
            rotate: [0, 20, -15, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <FloatingParticles />

      </div>
    </>
  );
}