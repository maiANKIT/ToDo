import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, Star, PartyPopper } from "lucide-react";
import "./CelebrationOverlay.css";

/* ─────────────────────────────────────────────────────────────────────
   Confetti particle system
───────────────────────────────────────────────────────────────────── */

const COLORS = [
  "#6366f1", // indigo
  "#a855f7", // purple
  "#f59e0b", // amber
  "#10b981", // emerald
  "#60a5fa", // blue
  "#f43f5e", // rose
  "#34d399", // teal
  "#facc15", // yellow
];

const SHAPES = ["square", "circle", "strip"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createParticle(canvas) {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    x: randomBetween(canvas.width * 0.3, canvas.width * 0.7),
    y: randomBetween(canvas.height * 0.3, canvas.height * 0.55),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape,
    size: randomBetween(shape === "strip" ? 3 : 5, shape === "strip" ? 6 : 11),
    length: randomBetween(14, 22), // for strips
    vx: randomBetween(-7, 7),
    vy: randomBetween(-18, -6),
    gravity: randomBetween(0.35, 0.6),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.18, 0.18),
    opacity: 1,
    decay: randomBetween(0.012, 0.022),
  };
}

function drawParticle(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.opacity);
  ctx.fillStyle = p.color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  if (p.shape === "square") {
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  } else if (p.shape === "circle") {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // strip
    ctx.fillRect(-p.length / 2, -p.size / 2, p.length, p.size);
  }

  ctx.restore();
}

function updateParticle(p) {
  p.vy += p.gravity;
  p.x += p.vx;
  p.y += p.vy;
  p.rotation += p.rotationSpeed;
  p.opacity -= p.decay;
}

function launchConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 120 }, () => createParticle(canvas));
  let rafId;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alive = particles.filter((p) => p.opacity > 0);
    alive.forEach((p) => {
      updateParticle(p);
      drawParticle(ctx, p);
    });
    if (alive.length > 0) {
      rafId = requestAnimationFrame(tick);
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────── */

/**
 * Props
 *   active    — boolean: show the overlay
 *   onDismiss — () => void: called when user closes or timer fires
 *   taskTitle — optional string shown inside the card
 *   autoDismissMs — how long before auto-close (default 4000)
 */
const CelebrationOverlay = ({
  active,
  onDismiss,
  taskTitle,
  autoDismissMs = 4000,
}) => {
  const canvasRef = useRef(null);
  const cleanupRef = useRef(null);
  const timerRef = useRef(null);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Start confetti when active becomes true
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to fill viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Slight delay so the overlay is painted first
    const launchTimer = setTimeout(() => {
      cleanupRef.current = launchConfetti(canvas);
    }, 80);

    // Auto-dismiss
    timerRef.current = setTimeout(handleDismiss, autoDismissMs);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(timerRef.current);
      cleanupRef.current?.();
    };
  }, [active, autoDismissMs, handleDismiss]);

  // Close on Escape
  useEffect(() => {
    if (!active) return;
    const fn = (e) => { if (e.key === "Escape") handleDismiss(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [active, handleDismiss]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="cel-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleDismiss}
          aria-modal="true"
          role="dialog"
          aria-label="All subtasks complete"
        >
          {/* canvas lives inside but covers the whole viewport */}
          <canvas ref={canvasRef} className="cel-canvas" />

          {/* ── Card ── */}
          <motion.div
            className="cel-card"
            initial={{ opacity: 0, scale: 0.72, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 26, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button className="cel-close" onClick={handleDismiss} aria-label="Close">
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* animated icon ring */}
            <motion.div
              className="cel-icon-ring"
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 }}
            >
              <motion.div
                className="cel-icon-inner"
                animate={{ rotate: [0, -8, 8, -4, 0] }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <PartyPopper size={32} strokeWidth={1.6} />
              </motion.div>

              {/* orbiting stars */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <motion.span
                  key={i}
                  className="cel-orbit-star"
                  style={{ "--deg": `${deg}deg` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.9, ease: "easeOut" }}
                >
                  <Star size={10} fill="currentColor" />
                </motion.span>
              ))}
            </motion.div>

            {/* text */}
            <motion.div
              className="cel-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="cel-heading">All done!</h2>
              {taskTitle ? (
                <p className="cel-sub">
                  Every subtask in <strong>{taskTitle}</strong> is complete.
                </p>
              ) : (
                <p className="cel-sub">Every subtask is complete. Excellent focus.</p>
              )}
            </motion.div>

            {/* completion chips */}
            <motion.div
              className="cel-chips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
            >
              <span className="cel-chip cel-chip--green">
                <CheckCircle2 size={13} strokeWidth={2.5} /> Subtasks complete
              </span>
              <span className="cel-chip cel-chip--indigo">
                <Star size={12} fill="currentColor" /> Streak updated
              </span>
            </motion.div>

            {/* progress bar that drains down to auto-dismiss */}
            <div className="cel-timer-track">
              <motion.div
                className="cel-timer-bar"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;