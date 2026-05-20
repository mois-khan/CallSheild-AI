import React from 'react';
import { ShieldAlert, EyeOff, ShieldCheck, FileText, Smartphone, AlertTriangle } from 'lucide-react';
import styles from '../styles/Features.module.css';

function Features() {
  const featureList = [
    {
      icon: <Smartphone className={styles.cardIcon} size={28} />,
      title: 'Grandma Mode (Auto-Hangup)',
      description: 'When armed, the app bypasses human error. If a critical scam threshold (>=95%) is hit, a native Kotlin method channel triggers Android\'s TelecomManager to forcefully drop the call.'
    },
    {
      icon: <EyeOff className={styles.cardIcon} size={28} />,
      title: 'Zero-Knowledge PII Scrubber',
      description: 'Privacy-first processing. Locally sanitizes transcripts via high-precision Regex filters, redacting Aadhaar cards, credit numbers, and OTP PINs before they ever reach the cloud LLM.'
    },
    {
      icon: <ShieldAlert className={styles.cardIcon} size={28} />,
      title: 'Emergency SOS Dispatch',
      description: 'Bypasses standard Android 14 restrictions to silently fire a custom physical SMS directly to saved emergency contacts, warning them to intervene and calling back immediately.'
    },
    {
      icon: <FileText className={styles.cardIcon} size={28} />,
      title: 'Forensic PDF FIR Reports',
      description: 'Automatically compiles call timelines, Caller IDs, flagged psychological tactics, and the redacted transcript into a secure PDF, pre-drafting an email to the Cyber Crime cell with one tap.'
    },
    {
      icon: <ShieldCheck className={styles.cardIcon} size={28} />,
      title: 'Live Threat Radar',
      description: 'A visual cybersecurity command center inside the app. Updates transcripts sentence-by-sentence and highlights security analysis, alerts, and scam probability levels.'
    },
    {
      icon: <AlertTriangle className={styles.cardIcon} size={28} />,
      title: 'Anti-Spam Modal Lock',
      description: 'Includes strict state protection locks to prevent high-frequency AI streams from spawning multiple overlapping UI bottom sheets, keeping the interface fluid under constant scam pressure.'
    }
  ];

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={`${styles.container} section-wrapper`}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Engineered for Proactive Interception</h2>
          <p className={styles.sectionSubtitle}>
            CallShield isn't a simple warning banner. It is a full voice firewall equipped with native hardware overrides.
          </p>
        </div>

        <div className={styles.grid}>
          {featureList.map((item, index) => (
            <div key={index} className="premium-card">
              <div className={styles.iconWrapper}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
