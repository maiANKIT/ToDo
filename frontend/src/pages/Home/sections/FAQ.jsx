import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is TodoFlow free to use?",
    answer:
      "Yes. TodoFlow offers a free plan with all essential productivity features. Premium features will be available in future releases.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. Create workspaces, invite members, assign tasks, and collaborate in real time.",
  },
  {
    question: "Does TodoFlow support Kanban boards?",
    answer:
      "Yes. Switch between List, Grid, and Kanban views anytime without losing your data.",
  },
  {
    question: "Can I access TodoFlow offline?",
    answer:
      "Yes. TodoFlow is a Progressive Web App (PWA), allowing you to continue working even with limited connectivity.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Authentication, protected routes, and secure APIs help keep your data safe.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(0);

  const toggle = (index) => {
    setActive(active === index ? -1 : index);
  };

  return (
    <section className="faq-section" id="faq">

      <div className="container">

        <div className="section-heading">

          <span className="section-tag">
            FAQ
          </span>

          <h2>
            Frequently Asked Questions
          </h2>

          <p>
            Everything you need to know before getting started.
          </p>

        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="faq-item"
            >

              <button
                className="faq-question"
                onClick={() => toggle(index)}
              >

                <span>{faq.question}</span>

                {active === index ? (
                  <Minus size={20} />
                ) : (
                  <Plus size={20} />
                )}

              </button>

              <AnimatePresence>

                {active === index && (

                  <motion.div
                    className="faq-answer"
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: .25,
                    }}
                  >

                    <p>{faq.answer}</p>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}