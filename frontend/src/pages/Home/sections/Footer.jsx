import { ArrowUpRight } from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

import logo from "../../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* Brand */}

          <div className="footer-brand">

            <div className="footer-logo">

              <img
                src={logo}
                alt="TodoFlow"
              />

              <span>TodoFlow</span>

            </div>

            <p>

              A modern productivity platform
              built for students, developers
              and teams to organize work,
              collaborate efficiently and
              achieve more every day.

            </p>

            <div className="footer-social">

              <a
                href="#"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="#"
                aria-label="X"
              >
                <FaXTwitter />
              </a>

            </div>

          </div>

          {/* Product */}

          <div className="footer-links">

            <h4>Product</h4>

            <a href="#features">Features</a>

            <a href="#workspace">Workspace</a>

            <a href="#analytics">Analytics</a>

            <a href="#">Calendar</a>

          </div>

          {/* Resources */}

          <div className="footer-links">

            <h4>Resources</h4>

            <a href="#faq">FAQ</a>

            <a href="#">Documentation</a>

            <a href="#">Roadmap</a>

            <a href="#">Support</a>

          </div>

          {/* Company */}

          <div className="footer-links">

            <h4>Company</h4>

            <a href="#">About</a>

            <a href="#">Privacy</a>

            <a href="#">Terms</a>

            <a href="#">Contact</a>

          </div>

        </div>

        <div className="footer-bottom">

          <p>

            © {new Date().getFullYear()} TodoFlow.
            All rights reserved.

          </p>

          <span>

            Built for productivity

            <ArrowUpRight size={16} />

          </span>

        </div>

      </div>

    </footer>
  );
}