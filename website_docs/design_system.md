# 🎨 CallShield AI Website: Design System

This document specifies the design guidelines, variables, color palettes, typography, and animation tokens for the CallShield AI web interface. 

---

## 🎨 1. Color Palette (Synced with Flutter App Theme)

We use a deep, modern cybersecurity aesthetic featuring dark backgrounds, crisp text, and highly contrasted status indicators (warning red, safety green, active indigo).

### CSS Custom Properties (`index.css` definitions)
```css
:root {
  /* Brand Colors */
  --color-primary: #6366f1;         /* Electric Indigo (Flutter Primary) */
  --color-primary-glow: rgba(99, 102, 241, 0.15);
  
  /* Backgrounds & Surfaces */
  --color-bg-dark: #0f172a;         /* Slate Black (App Scaffold BG) */
  --color-surface-dark: #1e1e2a;    /* Deep Slate Navy (Cards & Modals) */
  --color-surface-card: #1e293b;    /* Highlight slate navy */
  --color-border: rgba(255, 255, 255, 0.08);
  
  /* Status Colors */
  --color-scam-red: #ef4444;        /* Warning Red (Alert Modal, Scammer ID) */
  --color-scam-red-glow: rgba(239, 68, 68, 0.2);
  --color-safety-green: #10b981;    /* Emerald Green (Receipt, Secure Status) */
  --color-safety-green-glow: rgba(16, 185, 129, 0.25);
  --color-accent-teal: #14b8a6;      /* Teal Accent for secondary details */
  
  /* Typography Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #94a3b8;  /* Muted Grey Text */
  --color-text-dim: #64748b;        /* Deep Muted Dark Gray */
  
  /* Fonts */
  --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## ✍️ 2. Typography & Hierarchy

To match the mobile app, we load and apply **Plus Jakarta Sans** via Google Fonts. All elements must follow structured semantic heading hierarchies:

*   **Page Title / Hero H1**: `font-size: 3.5rem; line-height: 1.2; font-weight: 800; letter-spacing: -0.02em;`
*   **Section Headers H2**: `font-size: 2.25rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em;`
*   **Card Titles H3**: `font-size: 1.25rem; line-weight: 1.4; font-weight: 600;`
*   **Body Copy (Standard)**: `font-size: 1rem; line-height: 1.6; font-weight: 400; color: var(--color-text-secondary);`
*   **Code/Terminal Text**: `font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.875rem;`

---

## 🔮 3. Glassmorphism & Card Styles

To create a premium UI experience, cards and panels will leverage CSS backdrop filters (glassmorphism):

```css
.premium-glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.premium-glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.1);
}
```

---

## 🔄 4. Custom Keyframe Animations

We will build standard keyframe-based CSS animations for active threat scanning, radar pulses, and call interrupts:

### A. Pulsing Security Radar
Pulsing rings around the security shield icon to signify active monitoring:
```css
@keyframes radar-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5);
  }
  70% {
    transform: scale(1.1);
    opacity: 0.4;
    box-shadow: 0 0 0 20px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}
```

### B. Threat Alarm Flash
Alarm flashing effect triggered during `CRITICAL` or `KILL_CALL` simulator states:
```css
@keyframes threat-alarm-flash {
  0%, 100% {
    background-color: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.3);
  }
  50% {
    background-color: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.8);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
  }
}
```

### C. Live Terminal Log Ingest
Simulates incoming text typewriter/scroll:
```css
@keyframes line-glow {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
