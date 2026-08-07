import { useEffect, useState } from "react";
import Stats from "./sections/Stats";
// import CTA from "./sections/CTA";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Workspace from "./sections/Workspace";
import Analytics from "./sections/Analytics";
import Calendar from "./sections/Calendar";
import Features from "./sections/Features";
import FAQ from "./sections/FAQ";
import Footer from "./sections/Footer";
import CTA from "./sections/CTA";

import "./Home.css";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setScrolled(window.scrollY > 20);

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <div className="landing-page">

      <Navbar
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Hero />

      <Stats />

      <Workspace />

      <Analytics />

      <Calendar />

      <Features />

      <FAQ />

      <CTA />

      <Footer />

    </div>
  );
}