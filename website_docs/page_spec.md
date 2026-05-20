# 📄 CallShield AI Website: Page Specification & Layout

This document defines the layouts, copy blocks, component functionalities, and UI states for every section of the **CallShield AI** landing page.

---

## 🏛️ 1. Global Components

### 1.1 Navigation Header (`Navbar`)
*   **Layout**: Fixed top, glassmorphism overlay (`backdrop-filter`).
*   **Elements**:
    *   *Left*: Shield Icon + Text: `CallShield AI`
    *   *Center*: Links: Features, Interactive Demo, Installation Guide, Developer Docs.
    *   *Right*: High-visibility CTA button: **Download APK** (triggers immediate local file download).
*   **Interactions**: Smooth-scroll transitions when links are clicked.

### 1.2 Footer (`Footer`)
*   **Layout**: Low-contrast, clean structured footer.
*   **Elements**: Copyright notices, link to Git repository, and system-level blueprints.

---

## 🧭 2. Page Sections

### 2.1 Hero Header (`Hero`)
*   **Goal**: Create an immediate premium impression and outline the problem-solving premise.
*   **Layout**: Two-column responsive layout (Left: Text, Right: Device Mockup).
*   **Left Column (Copy)**:
    *   *Category*: `🛡️ THE WORLD'S FIRST AUTONOMOUS VOICE FIREWALL`
    *   *Headline*: `Your Phone's Active Digital Bodyguard Against Social Engineering`
    *   *Sub-headline*: `CallShield intercepts, scans, and forcefully cuts phone calls in real-time if a critical threat is detected—bypassing user compliance and fear.`
    *   *Buttons*:
        *   CTA 1: **Download APK (Instant)**
        *   CTA 2: **Watch Demo** (Smooth scrolls to the Simulator section)
*   **Right Column (Mockup)**:
    *   A high-fidelity SVG/CSS vector representation of an Android phone frame.
    *   The mockup displays the **Live Radar UI** in action: a glowing shield, pulsing background circles, and an autoscrolling terminal log showing messages:
        *   `[SYSTEM] Monitoring engine initialized...`
        *   `[SYSTEM] Telecom channel active...`
        *   `[SYSTEM] Threat radar running...`

---

### 2.2 Interactive Call Simulator (`ScamSimulator`)
*   **Goal**: Show, don't tell. Allow visitors to see the app's real-time interception and call-termination flow.
*   **Layout**: Split grid. Left: Scenario Controllers, Right: Active Device Mockup.
*   **Left Control Panel**:
    *   Includes toggle switches to choose scam scenarios:
        1.  **FedEx Illegal Customs Scam**: Fraudster claims a package sent under the user's name contains illegal substances.
        2.  **TRAI Disconnection Alert**: Impersonator claims the user's telecom line is being suspended immediately due to cybercrime allegations.
    *   A large action button: **[Simulate Call Session]** / **[Reset Simulation]**
    *   An animated threat meter tracking the progress during execution.
*   **Right Mockup (Interactive States)**:
    *   *Stage 1: Incoming*: Phone rings. Custom dialer UI shows up with "CBI/Customs Alert" Caller ID.
    *   *Stage 2: Answered*: Call connects. Audio waves animate.
    *   *Stage 3: Streaming*: Script text prints sentence-by-sentence. Sensitive fields (like Aadhaar card number) are printed and immediately redacted with a black highlighting overlay to demonstrate the PII Scrubber.
    *   *Stage 4: Warn*: Threat gauge reaches 70%. Background lights turn warning orange. A mockup SMS notification slides down from the top: `SOS Alert: Sending details to trusted contact.`
    *   *Stage 5: Cut*: Threat gauge hits 95%. Screen flashes red. The text `KILL_CALL RECEIVED` blinks. A click sound effect plays, and the call screen vanishes.
    *   *Stage 6: Receipt*: Renders a beautiful post-call summary panel (Grandma Mode Receipt) showing:
        *   `Threat Level: 98% (Critical)`
        *   `Neutralized Action: Dropped call via Kotlin MethodChannel`
        *   `Forensic Document: FIR Report generated successfully`

---

### 2.3 Feature Spotlight (`Features`)
*   **Goal**: Detailed explanation of technical capabilities using premium hover-effect cards.
*   **Cards**:
    1.  **Grandma Mode (Auto-Hangup)**: Explanation of the native OS Kotlin bridge that disconnects the line automatically to remove human error.
    2.  **Zero-Knowledge PII Scrubber**: Highlights regex scanning that filters financial credentials on-device before any transcript is sent to external APIs.
    3.  **Emergency SOS Dispatch**: Details background SMS triggers that bypass Android 14 restrictions to notify family.
    4.  **Forensic FIR Generator**: Explains the automatic compiler that outputs court-admissible call records and transcript evidence into an official PDF report.

---

### 2.4 How it Works (`HowItWorks`)
*   **Goal**: Explain the low-latency technical routing backend.
*   **Layout**: Horizontal stepper layout (1 to 4):
    1.  *Audio Ingestion*: Twilio routes live voice stream to backend WebSockets.
    2.  *Low-Latency Transcription*: Deepgram Nova-2 processes speech into text.
    3.  *AI Cognitive Verdict*: Gemini 3.1 Flash-Lite parses psychological contexts.
    4.  *Hardware Override*: Kotlin interface triggers local hangup.

---

### 2.5 Run & Setup Instructions (`InstallGuide`)
*   **Goal**: High-fidelity instructions for running the project.
*   **Layout**: Tabbed card (Tab 1: **User Install**, Tab 2: **Developer Setup**).
*   **Tab 1 Content**:
    *   1. Enable "Install Unknown Sources" in Android settings.
    *   2. Download the APK file directly using the download CTA.
    *   3. Open the app and input emergency contact details.
    *   4. Arm monitoring mode.
*   **Tab 2 Content**:
    *   Commands to clone the repository.
    *   Steps to setup `.env` configs (Gemini, Deepgram API keys).
    *   Directions to start the backend with `npm start`.
    *   Ngrok endpoint binding instructions to pipe audio.
    *   Running the Flutter app in development environment.
