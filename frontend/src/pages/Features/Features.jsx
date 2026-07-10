import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";

import "./Features.css";

export default function Features() {
  return (
    <div className="features-page">

      <Navbar hideSearch />

      <main className="features-main">

        {/* ================= HERO ================= */}

        <section className="hero">

          {/* Background */}

          <div className="hero-blur blur-one"></div>
          <div className="hero-blur blur-two"></div>

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >

            <div className="hero-badge">

              <Sparkles size={16} />

              <span>

                Introducing Workspace Collaboration

              </span>

            </div>

            <h1>

              Organize.

              <br />

              Collaborate.

              <br />

              <span>Achieve More.</span>

            </h1>

            <p>

              TodoFlow is more than a task manager.

              It combines productivity, collaboration,
              workspaces, analytics and planning into
              one seamless experience built for
              developers, students and modern teams.

            </p>

            <div className="hero-buttons">

              <button className="hero-primary">

                Explore Dashboard

                <ArrowRight size={18} />

              </button>

              <button className="hero-secondary">

                <Play size={18} />

                Product Tour

              </button>

            </div>

          </motion.div>

        </section>

        {/* ================= PLATFORM OVERVIEW ================= */}

<section className="platform-overview">

  <div className="platform-header">

    <span>Everything in one place</span>

    <h2>

      Designed for modern productivity.

    </h2>

    <p>

      TodoFlow combines planning, collaboration,
      analytics and customization into one seamless
      workspace experience.

    </p>

  </div>

  <div className="platform-grid">

    <div className="platform-card large">

      <div>

        <p className="platform-label">

          Productivity

        </p>

        <h3>

          45+

        </h3>

        <span>

          Powerful features

        </span>

      </div>

    </div>

    <div className="platform-card">

      <p className="platform-label">

        Themes

      </p>

      <h3>

        6

      </h3>

      <span>

        Beautiful experiences

      </span>

    </div>

    <div className="platform-card">

      <p className="platform-label">

        Collaboration

      </p>

      <h3>

        5

      </h3>

      <span>

        Workspace roles

      </span>

    </div>

    <div className="platform-card">

      <p className="platform-label">

        Views

      </p>

      <h3>

        Grid · List · Kanban · Calendar

      </h3>

    </div>

  </div>

</section>



      </main>

    </div>
  );
}