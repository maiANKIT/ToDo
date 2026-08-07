import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CheckSquare,
  BarChart3,
  Palette,
  Bell,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Multiple Task Views",
    description:
      "Switch between List, Grid and Kanban views based on your workflow.",
    large: true,
  },
  {
    icon: Users,
    title: "Workspace",
    description:
      "Invite teammates and collaborate on shared projects.",
  },
  {
    icon: CheckSquare,
    title: "Subtasks",
    description:
      "Break large goals into smaller manageable tasks.",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description:
      "Plan deadlines and visualize your schedule.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track productivity and completion trends.",
    large: true,
  },
  {
    icon: Palette,
    title: "Themes",
    description:
      "Personalize TodoFlow with multiple beautiful themes.",
  },
  {
    icon: Bell,
    title: "Reminders",
    description:
      "Stay on top of every important deadline.",
  },
  {
    icon: Smartphone,
    title: "PWA Support",
    description:
      "Install TodoFlow like a native application.",
  },
];

export default function Features() {
  return (
    <section
      className="features-section"
      id="features"
    >
      <div className="container">

        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">
            FEATURES
          </span>

          <h2>
            Everything you need
            in one workspace.
          </h2>

          <p>
            Powerful tools designed for students,
            developers and growing teams.
          </p>
        </motion.div>

        <div className="bento-grid">

          {features.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={index}
                className={`bento-card ${
                  item.large ? "large" : ""
                }`}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * .05,
                }}
              >

                <div className="bento-icon">

                  <Icon size={24} />

                </div>

                <h3>

                  {item.title}

                </h3>

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