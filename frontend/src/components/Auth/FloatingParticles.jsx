import { motion } from "framer-motion";

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 2 + Math.random() * 5,
  duration: 16 + Math.random() * 12,
  delay: Math.random() * 10,
}));

export default function FloatingParticles() {
  return (
    <div className="particles">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          initial={{
            y: "110vh",
            opacity: 0,
            scale: 0.4,
          }}
          animate={{
            y: "-20vh",
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 0.7],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}