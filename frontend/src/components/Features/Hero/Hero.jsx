import {
  FiArrowRight,
  FiGrid,
  FiUsers,
  FiLayers,
  FiPalette,
  FiMonitor,
} from "react-icons/fi";

import "./Hero.css";

const stats = [
  {
    value: "45+",
    label: "Features",
    icon: <FiGrid />,
  },
  {
    value: "6",
    label: "Themes",
    icon: <FiPalette />,
  },
  {
    value: "5",
    label: "Workspace Roles",
    icon: <FiUsers />,
  },
  {
    value: "4",
    label: "Views",
    icon: <FiLayers />,
  },
  {
    value: "100%",
    label: "Responsive",
    icon: <FiMonitor />,
  },
];

export default function Hero() {
  return (
    <section className="features-hero">

      <div className="hero-bg hero-bg-1"></div>
      <div className="hero-bg hero-bg-2"></div>

      <div className="hero-content">

        <span className="hero-badge">
          TodoFlow Platform
        </span>

        <h1>

          Productivity

          <span> without complexity.</span>

        </h1>

        <p>

          TodoFlow combines task management,
          collaboration, analytics and workspace
          management into one modern productivity
          platform.

        </p>

        <div className="hero-actions">

          <button className="hero-primary">

            Explore Dashboard

            <FiArrowRight />

          </button>

          <button className="hero-secondary">

            Browse Features

          </button>

        </div>

      </div>

      <div className="hero-stats">

        {stats.map((item) => (

          <div
            key={item.label}
            className="hero-stat-card"
          >

            <div className="stat-icon">

              {item.icon}

            </div>

            <h2>

              {item.value}

            </h2>

            <p>

              {item.label}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}