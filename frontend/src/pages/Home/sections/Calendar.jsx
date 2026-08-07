import { motion } from "framer-motion";
import {
  CalendarDays,
  Bell,
  Clock3,
  Repeat2,
} from "lucide-react";

export default function Calendar() {
  return (
    <section className="calendar-section">

      <div className="container calendar-container">

        {/* LEFT */}

        <motion.div
          className="calendar-content"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >

          <span className="section-tag">

            CALENDAR

          </span>

          <h2>

            Never miss an important deadline.

          </h2>

          <p>

            View upcoming tasks, deadlines,
            meetings and reminders in one
            beautiful calendar designed for
            planning your entire workflow.

          </p>

          <div className="calendar-features">

            <div>

              <CalendarDays size={20} />

              Monthly Calendar

            </div>

            <div>

              <Bell size={20} />

              Smart Reminders

            </div>

            <div>

              <Clock3 size={20} />

              Due Dates

            </div>

            <div>

              <Repeat2 size={20} />

              Recurring Tasks

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          className="calendar-preview"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >

          <div className="calendar-card">

            <div className="calendar-header">

              <h3>July 2026</h3>

              <span>Today</span>

            </div>

            <div className="calendar-grid">

              {["S","M","T","W","T","F","S"].map(day=>(
                <div key={day} className="calendar-day-name">
                  {day}
                </div>
              ))}

              {Array.from({length:35}).map((_,index)=>{

                const active=index===18;

                return(

                  <div
                    key={index}
                    className={`calendar-day ${
                      active ? "active" : ""
                    }`}
                  >

                    {index+1<=31 ? index+1 : ""}

                  </div>

                );

              })}

            </div>

            <div className="calendar-events">

              <div>

                <strong>10:30 AM</strong>

                <span>Workspace Meeting</span>

              </div>

              <div>

                <strong>4:00 PM</strong>

                <span>Deploy TodoFlow</span>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}