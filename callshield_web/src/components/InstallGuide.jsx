import React, { useState } from 'react';
import { UserCheck, Code2, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from '../styles/InstallGuide.module.css';

function InstallGuide() {
  const [activeTab, setActiveTab] = useState('user');

  const userSteps = [
    {
      title: 'Enable Unknown Sources',
      desc: 'Open Settings on your Android phone, go to Security or Apps, and enable "Install from Unknown Sources" or authorize browser installs.'
    },
    {
      title: 'Download the APK',
      desc: 'Click any download button on this page to get the verified callshield-ai.apk (51.5 MB) directly to your downloads directory.'
    },
    {
      title: 'Configure Emergency Contacts',
      desc: 'Launch CallShield. Grant Telecom and SMS permissions, and input your Emergency SOS phone numbers (no emojis allowed).'
    },
    {
      title: 'Arm & Active Defense',
      desc: 'Turn on the toggle switch on the home screen dashboard to run the background service isolate. CallShield is now active.'
    }
  ];

  const devSteps = [
    {
      title: 'Clone & Install Backend',
      desc: 'Clone the repo, navigate to callshield_backend/, and run npm install to set up the audio socket server.'
    },
    {
      title: 'Configure Environmental Variables',
      desc: 'Create a .env file with GEMINI_API_KEY and DEEPGRAM_API_KEY (Nova-2 transcription engine tokens).'
    },
    {
      title: 'Launch local Tunneling (Ngrok)',
      desc: 'Run ngrok http 8080 to get a secure HTTPS url. Twilio requires public webhook links to pipe live dual-channel voice audio.'
    },
    {
      title: 'Configure Twilio Webhook',
      desc: 'Register the ngrok url in Twilio\'s console as the incoming call webhook: /calls/incoming.'
    },
    {
      title: 'Build & Deploy Flutter Client',
      desc: 'Configure callshield_app/.env to match your ngrok WS URL, and execute flutter run on an Android 14+ test device.'
    }
  ];

  return (
    <section id="install" className={styles.section}>
      <div className={`${styles.container} section-wrapper`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Deployment & Setup</h2>
          <p className={styles.subtitle}>
            Install CallShield on an Android device, or spin up a local development instance of the full telecom defense pipeline.
          </p>
        </div>

        {/* Tab Controls */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('user')}
            className={`${styles.tabBtn} ${activeTab === 'user' ? styles.tabBtnActive : ''}`}
          >
            <UserCheck size={18} />
            <span>Quick Install (APK)</span>
          </button>
          <button
            onClick={() => setActiveTab('dev')}
            className={`${styles.tabBtn} ${activeTab === 'dev' ? styles.tabBtnActive : ''}`}
          >
            <Code2 size={18} />
            <span>Developer Setup</span>
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.tabContent}>
          {activeTab === 'user' ? (
            <div className={styles.setupPane}>
              <div className={styles.stepsCol}>
                {userSteps.map((step, idx) => (
                  <div key={idx} className={styles.stepItem}>
                    <div className={styles.stepBullet}>
                      <CheckCircle2 size={18} className={styles.bulletIcon} />
                      <span>Step {idx + 1}</span>
                    </div>
                    <div className={styles.stepText}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.ctaCol}>
                <div className={styles.downloadCard}>
                  <h3 className={styles.cardTitle}>Ready to Deploy?</h3>
                  <p className={styles.cardText}>
                    Get the production package straight to your phone. Installs natively on API level 28+.
                  </p>
                  <a href="/assets/callshield-ai.apk" className="btn btn-primary" download>
                    <Download size={18} />
                    Download APK
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.setupPane}>
              <div className={styles.stepsColFull}>
                {devSteps.map((step, idx) => (
                  <div key={idx} className={styles.stepItem}>
                    <div className={styles.stepBulletDev}>
                      <span>{idx + 1}</span>
                    </div>
                    <div className={styles.stepText}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default InstallGuide;
