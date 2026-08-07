import { motion } from "framer-motion";
import {
  LayoutGrid,
  Palette,
  Users,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    icon: LayoutGrid,
    value: "45+",
    title: "Powerful Features",
    description:
      "Task management, Kanban, Calendar, Analytics and much more.",
  },
  {
    icon: Palette,
    value: "6",
    title: "Beautiful Themes",
    description:
      "Switch between Light, Dark, Ocean, Sunset, Forest and Lavender.",
  },
  {
    icon: Users,
    value: "Workspace",
    title: "Real-time Collaboration",
    description:
      "Invite members, assign tasks and work together seamlessly.",
  },
  {
    icon: ShieldCheck,
    value: "99.9%",
    title: "Reliable",
    description:
      "Fast, secure and always available whenever you need it.",
  },
];

export default function Stats() {
  return (
    <section className="stats-section">

      <div className="container">

        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >

          <span className="section-tag">

            WHY TODOFLOW

          </span>

          <h2>

            Everything you need
            <br />
            to stay productive.

          </h2>

          <p>

            Built for students,
            developers,
            professionals
            and growing teams.

          </p>

        </motion.div>

        <div className="stats-grid">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                className="stat-card"
                initial={{
                  opacity: 0,
                  y: 30
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: .45,
                  delay: index * .08
                }}
              >

                <div className="stat-icon">

                  <Icon size={24} />

                </div>

                <h3>

                  {item.value}

                </h3>

                <h4>

                  {item.title}

                </h4>

                <p>

                  {item.description}

                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}