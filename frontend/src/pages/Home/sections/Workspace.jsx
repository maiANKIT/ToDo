import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  Clock3,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export default function Workspace() {
  return (
    <section className="workspace-section" id="workspace">

      <div className="container workspace-container">

        {/* Left */}

        <motion.div
          className="workspace-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >

          <span className="section-tag">

            WORKSPACE

          </span>

          <h2>

            Collaborate with your
            <br />

            entire team.

          </h2>

          <p>

            Create shared workspaces,
            invite teammates,
            assign tasks,
            discuss progress,
            and keep every project organized
            in one place.

          </p>

          <div className="workspace-features">

            <div>

              <CheckCircle2 size={20} />

              Shared Projects

            </div>

            <div>

              <Users size={20} />

              Team Members

            </div>

            <div>

              <Clock3 size={20} />

              Activity Timeline

            </div>

            <div>

              <MessageSquare size={20} />

              Task Discussion

            </div>

          </div>

          <button className="workspace-btn">

            Explore Workspace

            <ArrowRight size={18} />

          </button>

        </motion.div>

        {/* Right */}

        <motion.div
          className="workspace-right"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >

          <div className="workspace-card">

            <div className="workspace-card-header">

              <div>

                <h3>

                  Web Development

                </h3>

                <span>

                  5 Members

                </span>

              </div>

              <span className="workspace-status">

                Active

              </span>

            </div>

            <div className="workspace-members">

              <div>A</div>

              <div>R</div>

              <div>K</div>

              <div>P</div>

              <div>+</div>

            </div>

            <div className="workspace-tasks">

              <div className="workspace-task">

                <span>Landing Page</span>

                <label>Done</label>

              </div>

              <div className="workspace-task">

                <span>Backend APIs</span>

                <label>In Progress</label>

              </div>

              <div className="workspace-task">

                <span>Authentication</span>

                <label>Pending</label>

              </div>

              <div className="workspace-task">

                <span>Deploy Website</span>

                <label>Pending</label>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}