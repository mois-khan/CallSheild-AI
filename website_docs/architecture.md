# 🏗️ CallShield AI Website: Architecture Specification

This document details the software architecture, component hierarchy, state management, and file structure for the **CallShield AI** React landing page.

---

## ⚡ 1. Technology Stack

*   **Framework**: React (Vite-based SPA)
*   **Styling**: Vanilla CSS (CSS Modules for local component styling, and a clean global CSS file for theme-level custom variables, animations, and transitions).
*   **Icons**: React Icons (lucide-react or similar feather icon set).
*   **Build Pipeline**: Vite for blazing fast development server and optimized single-page build output.

---

## 📂 2. Directory & File Structure

The project will reside entirely in a new root-level directory, `callshield_web/`, keeping the existing backend and Flutter codebases intact.

```
callshield_web/
├── package.json
├── vite.config.js
├── index.html
├── public/
│   ├── assets/
│   │   └── callshield-ai.apk         # Bundled app release binary
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── index.css                     # Global design tokens, keyframes, reset
│   ├── App.jsx                       # Main layout assembly
│   ├── components/
│   │   ├── Navbar.jsx                # Branding & Navigation
│   │   ├── Hero.jsx                  # Main header with primary phone mockup
│   │   ├── PhoneMockup.jsx           # Reusable SVG/CSS Animated Phone Frame
│   │   ├── ScamSimulator.jsx         # Interactive call simulator (Core Demo)
│   │   ├── Features.jsx              # Grid of unique features (Grandma Mode, etc.)
│   │   ├── HowItWorks.jsx            # Step-by-step visual pipeline representation
│   │   ├── InstallGuide.jsx          # Tabbed install/run instructions (User/Dev)
│   │   └── Footer.jsx                # Links & copyright
│   └── styles/
│       ├── Navbar.module.css
│       ├── Hero.module.css
│       ├── PhoneMockup.module.css
│       ├── ScamSimulator.module.css
│       ├── Features.module.css
│       ├── HowItWorks.module.css
│       └── InstallGuide.module.css
```

---

## 🏗️ 3. Component Hierarchy & Communication

The web application is designed as a single scroll-based page with the following hierarchy:

```
App.jsx (Coordinates active states, downloads, and scroll actions)
 ├── Navbar (Triggers scroll to sections, handles floating CTA download link)
 ├── Hero (Showcases core value proposition, houses first static-animated PhoneMockup)
 ├── ScamSimulator (Coordinates fake scam scenarios, triggers updates inside an interactive PhoneMockup)
 │    └── PhoneMockup (Displays transcript streams, threat percentages, and receipt screens)
 ├── Features (Renders clean cards for Grandma Mode, Zero-Knowledge Scrubber, SMS SOS, FIR PDF)
 ├── HowItWorks (Steps corresponding to the backend/Twilio/Deepgram/Gemini data cycle)
 ├── InstallGuide (Contains interactive tabs switching between "Quick Install" and "Developer Setup")
 └── Footer (Static links)
```

---

## 🔄 4. State Management (The Scam Call Simulator)

The core interactive feature is the **Scam Call Simulator**. It uses a state timeline machine to step through a live visual demo inside the phone mockup.

### Simulator States (`SimulatorState`)
1.  `IDLE`: Displaying a glowing "Monitoring Active" shield with a circular radar animation.
2.  `INCOMING`: Simulating an incoming cell call screen (Caller: "TRAI Officer" or "FedEx Customs").
3.  `CONNECTED`: Call is answered. Real-time transcript text starts printing, and a pulsing threat scanner runs.
4.  `ALERT`: Threat probability hits 65%. Screen flashes warning colors, SOS notification pops at the top.
5.  `CRITICAL`: Threat probability hits 95%. Grandma Mode warning flashes.
6.  `KILL_CALL`: Phone hangs up forcefully with a red screen and native disconnected click sound effect.
7.  `RECEIPT`: Renders a premium, emerald-green "Threat Neutralized" receipt detailing caller ID, tactics, and PDF reports saved.

### Data Feed Configuration
We will define static JSON tracks for simulated calls, including scripts for:
*   *Scenario A: FedEx Illegal Package Scam*
*   *Scenario B: TRAI Disconnection/Impersonation Scam*
