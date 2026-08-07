import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";

export default function Analytics() {
  return (
    <section className="analytics-section" id="analytics">

      <div className="container analytics-container">

        {/* LEFT */}

        <motion.div
          className="analytics-preview"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >

          <div className="analytics-window">

            <div className="analytics-top">

              <h3>Productivity Overview</h3>

              <span>This Week</span>

            </div>

            {/* Fake Chart */}

            <div className="chart">

              <div className="bar h1"></div>

              <div className="bar h2"></div>

              <div className="bar h3"></div>

              <div className="bar h4"></div>

              <div className="bar h5"></div>

              <div className="bar h6"></div>

              <div className="bar h7"></div>

            </div>

            <div className="analytics-bottom">

              <div>

                <strong>92%</strong>

                <span>Completion Rate</span>

              </div>

              <div>

                <strong>28</strong>

                <span>Tasks Finished</span>

              </div>

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="analytics-content"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >

          <span className="section-tag">

            ANALYTICS

          </span>

          <h2>

            Track your progress,
            not just your tasks.

          </h2>

          <p>

            Measure productivity with
            completion trends,
            activity history,
            daily performance,
            and detailed insights
            that help you improve.

          </p>

          <div className="analytics-features">

            <div>

              <TrendingUp size={20} />

              Completion Trends

            </div>

            <div>

              <BarChart3 size={20} />

              Daily Reports

            </div>

            <div>

              <Activity size={20} />

              Activity Heatmap

            </div>

            <div>

              <Target size={20} />

              Productivity Goals

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}