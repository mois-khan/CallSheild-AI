import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import styles from '../styles/PhoneMockup.module.css';

function PhoneMockup({ children, statusState = 'idle' }) {
  // Map status states to CSS class overrides
  const getStatusClass = () => {
    switch (statusState) {
      case 'ringing':
        return styles.stateRinging;
      case 'alarm':
      case 'critical':
        return styles.stateAlarm;
      case 'disconnected':
        return styles.stateDisconnected;
      case 'secure':
        return styles.stateSecure;
      default:
        return styles.stateIdle;
    }
  };

  return (
    <div className={`${styles.phoneFrame} ${getStatusClass()}`}>
      {/* Outer physical details */}
      <div className={styles.buttonVolUp}></div>
      <div className={styles.buttonVolDown}></div>
      <div className={styles.buttonPower}></div>

      {/* Screen Inner Wrapper */}
      <div className={styles.screen}>
        {/* Notch and sensors */}
        <div className={styles.notch}>
          <div className={styles.camera}></div>
          <div className={styles.speaker}></div>
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.time}>14:33</div>
          <div className={styles.statusIcons}>
            <Signal size={14} className={styles.statusIcon} />
            <Wifi size={14} className={styles.statusIcon} />
            <Battery size={14} className={styles.statusIcon} />
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className={styles.displayContent}>
          {children}
        </div>

        {/* Navigation Bar/Pill */}
        <div className={styles.navBar}>
          <div className={styles.navPill}></div>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;
