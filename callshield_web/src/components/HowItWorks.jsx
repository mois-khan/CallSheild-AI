import React from 'react';
import { PhoneCall, AudioLines, BrainCircuit, ShieldAlert } from 'lucide-react';
import styles from '../styles/HowItWorks.module.css';

function HowItWorks() {
  const steps = [
    {
      icon: <PhoneCall size={24} />,
      num: '01',
      title: 'Voice Intercept',
      desc: 'The cellular network routes the live call audio stream (mu-law) to the Node.js backend WebSockets server in real-time.'
    },
    {
      icon: <AudioLines size={24} />,
      num: '02',
      title: 'Zero-Lag STT',
      desc: 'Deepgram Nova-2 converts the streaming voice into raw text transcripts with under 150ms transcription latency.'
    },
    {
      icon: <BrainCircuit size={24} />,
      num: '03',
      title: 'Gemini Context Scan',
      desc: 'Transcripts are sanitized locally, then streamed to Gemini 3.1 Flash-Lite to evaluate psychological pressure patterns.'
    },
    {
      icon: <ShieldAlert size={24} />,
      num: '04',
      title: 'OS Level override',
      desc: 'If scam risk triggers Grandma Mode, the app invokes native Kotlin telecom interfaces to forcefully end the connection.'
    }
  ];

  return (
    <section id="how-it-works" className={styles.section}>
      <div className={`${styles.container} section-wrapper`}>
        <div className={styles.header}>
          <h2 className={styles.title}>The Real-Time Defense Loop</h2>
          <p className={styles.subtitle}>
            How CallShield intercepts, analyzes, and terminates threat calls in less than 2 seconds.
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepTop}>
                <div className={styles.iconBox}>{step.icon}</div>
                <span className={styles.stepNum}>{step.num}</span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
              {index < steps.length - 1 && <div className={styles.connectorLine}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
