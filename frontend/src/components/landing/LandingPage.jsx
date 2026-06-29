import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import WhatIs from './WhatIs';
import Features from './Features';
import ExamPathways from './ExamPathways';
import HowItWorks from './HowItWorks';
import PainPoints from './PainPoints';
import Pricing from './Pricing';
import SignupSection from './SignupSection';
import Footer from './Footer';

export default function LandingPage({ hash }) {
  useEffect(() => {
    if (hash && hash.startsWith('#') && hash.length > 1) {
      // Smooth scroll to section if it exists
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [hash]);

  const onStart = () => {
    window.location.hash = '#signup';
  };

  return (
    <div className="bg-white scroll-smooth-area">
      <Navbar onStart={onStart} />
      <Hero />
      <WhatIs />
      <Features />
      <ExamPathways />
      <HowItWorks />
      <PainPoints />
      <Pricing />
      <SignupSection />
      <Footer />
    </div>
  );
}
