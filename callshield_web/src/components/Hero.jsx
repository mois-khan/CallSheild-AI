import React, { useEffect, useState } from 'react';
import { Download, Play, ShieldAlert, Cpu, EyeOff, Radio } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import styles from '../styles/Hero.module.css';

function Hero() {
  const [logLines, setLogLines] = useState([
    '[SYSTEM] Monitoring engine active...',
    '[SYSTEM] Connected to telecom gateway...'
  ]);

  // Simulate scrolling terminal log on the hero phone screen
  useEffect(() => {
    const logs = [
      '🗣️ [INBOUND] Hello, I am calling from TRAI...',
      '🛡️ [PII_SCRUBBER] Redacted credit details...',
      '🚨 [AI_BRAIN] Analyzing fraud tactics...',
      '[SYSTEM] Heartbeat ping (5000ms)...',
      '🗣️ [OUTBOUND] Why are you threatening me?',
      '⚠️ [AI_BRAIN] Alert: Threat score 78%',
      '🛡️ [PII_SCRUBBER] Masked Aadhaar number...',
      '[SYSTEM] Reconnect backoff synchronized...'
    ];

    let counter = 0;
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const nextLines = [...prev, logs[counter]];
        if (nextLines.length > 5) nextLines.shift();
        return nextLines;
      });
      counter = (counter + 1) % logs.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={`${styles.container} section-wrapper`}>
        <div className={styles.content}>
          <div className={styles.tagline}>
            <Radio className={styles.tagIcon} size={16} />
            <span>Autonomous Telecom Defense Grid</span>
          </div>
          
          <h1 className={styles.title}>
            Your Phone's Active <span className={styles.accentText}>Digital Bodyguard</span> Against Scams
          </h1>
          
          <p className={styles.description}>
            CallShield intercepts, scans, and forcefully cuts phone calls in real-time if a critical threat is detected—bypassing user compliance and fear to secure your assets.
          </p>

          <div className={styles.ctaGroup}>
            <a href="/assets/callshield-ai.apk" className="btn btn-primary btn-lg" download>
              <Download size={20} />
              Download APK (51.5 MB)
            </a>
            <button onClick={scrollToDemo} className="btn btn-secondary btn-lg">
              <Play size={20} />
              Watch Live Demo
            </button>
          </div>

          <div className={styles.badges}>
            <div className={styles.badgeItem}>
              <ShieldAlert size={18} className={styles.badgeIcon} />
              <span>Real-Time Interception</span>
            </div>
            <div className={styles.badgeItem}>
              <Cpu size={18} className={styles.badgeIcon} />
              <span>Gemini 3.1 AI Engine</span>
            </div>
            <div className={styles.badgeItem}>
              <EyeOff size={18} className={styles.badgeIcon} />
              <span>Zero-Knowledge Privacy</span>
            </div>
          </div>
        </div>

        {/* Hero Mockup displaying radar UI */}
        <div className={styles.mockupContainer}>
          <PhoneMockup statusState="ringing">
            <div className={styles.radarUi}>
              <div className={styles.radarHeader}>
                <span className={styles.radarDot}></span>
                <span>SECURE TELECOM FEED</span>
              </div>

              {/* Pulsing Shield */}
              <div className={styles.radarCircleContainer}>
                <div className={styles.pulseOuter}></div>
                <div className={styles.pulseInner}></div>
                <div className={styles.radarCore}>
                  <Radio className={styles.radarIcon} size={40} />
                </div>
              </div>

              <div className={styles.radarStatus}>
                <h3 className={styles.statusTitle}>Monitoring Active</h3>
                <p className={styles.statusSubtitle}>Scanning caller credentials...</p>
              </div>

              {/* Terminal logs */}
              <div className={styles.terminalContainer}>
                <div className={styles.terminalHeader}>
                  <span className={styles.dotRed}></span>
                  <span className={styles.dotYellow}></span>
                  <span className={styles.dotGreen}></span>
                  <span className={styles.terminalTitle}>live_radar_log</span>
                </div>
                <div className={styles.terminalBody}>
                  {logLines.map((line, index) => (
                    <div key={index} className={styles.terminalLine}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PhoneMockup>
        </div>
      </div>
    </section>
  );
}

export default Hero;
