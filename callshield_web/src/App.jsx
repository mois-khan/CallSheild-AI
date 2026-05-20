import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScamSimulator from './components/ScamSimulator';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import InstallGuide from './components/InstallGuide';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Header Section */}
      <Hero />

      {/* Interactive Scam Call Simulator */}
      <ScamSimulator />

      {/* Core Features Grid */}
      <Features />

      {/* Architecture Stepper */}
      <HowItWorks />

      {/* Installation Tab Guides */}
      <InstallGuide />

      {/* Footer Navigation */}
      <Footer />
    </>
  );
}

export default App;
