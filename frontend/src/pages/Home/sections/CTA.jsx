import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">

      <div className="container">

        <motion.div
          className="cta-card"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          <div className="cta-glow glow-one"></div>
          <div className="cta-glow glow-two"></div>

          <span className="cta-tag">
            START TODAY
          </span>

          <h2>
            Organize everything.
            <br />
            Accomplish anything.
          </h2>

          <p>
            TodoFlow helps you organize tasks, collaborate with your
            team, manage workspaces, and stay productive from
            anywhere.
          </p>

          <div className="cta-buttons">

            <button
              className="cta-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started Free

              <ArrowRight size={18} />
            </button>

            <button
              className="cta-secondary"
              onClick={() =>
                window.open(
                  "https://github.com/",
                  "_blank"
                )
              }
            >
              <FaGithub size={18} />

              View GitHub
            </button>

          </div>

        </motion.div>

      </div>

    </section>
  );
}