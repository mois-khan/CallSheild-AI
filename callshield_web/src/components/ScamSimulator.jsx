import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Phone, PhoneOff, Shield, AlertTriangle, CheckCircle2,
  RotateCcw, Play, Radio, MessageSquareWarning, FileText,
  Smartphone, PhoneIncoming
} from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import { scenarios, scenarioKeys } from '../data/scenarios';
import styles from '../styles/ScamSimulator.module.css';

// ─── Simulator Stage Constants ───
const STAGE = {
  IDLE: 'idle',
  INCOMING: 'incoming',
  CONNECTED: 'connected',
  STREAMING: 'streaming',
  ALERT: 'alert',
  KILL_CALL: 'kill_call',
  RECEIPT: 'receipt',
};

function ScamSimulator() {
  const [selectedScenario, setSelectedScenario] = useState(scenarioKeys[0]);
  const [stage, setStage] = useState(STAGE.IDLE);
  const [visibleLines, setVisibleLines] = useState([]);
  const [threatScore, setThreatScore] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [sosTriggered, setSosTriggered] = useState(false);

  const timerRef = useRef(null);
  const transcriptAreaRef = useRef(null);
  const scenario = scenarios[selectedScenario];

  // Auto-scroll ONLY the transcript container (not the page)
  useEffect(() => {
    const container = transcriptAreaRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [visibleLines]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ─── Core timeline driver ───
  const advanceLine = useCallback((lineIdx, currentScore) => {
    const lines = scenario.transcript;
    if (lineIdx >= lines.length) {
      // All lines exhausted — trigger kill
      setTimeout(() => setStage(STAGE.KILL_CALL), 800);
      setTimeout(() => setStage(STAGE.RECEIPT), 3500);
      return;
    }

    const line = lines[lineIdx];
    const newScore = Math.min(currentScore + line.threatBump, 100);

    setVisibleLines((prev) => [...prev, line]);
    setThreatScore(newScore);
    setCurrentLineIdx(lineIdx + 1);


    // Check for SOS trigger at 65%
    if (newScore >= 65 && !sosTriggered) {
      setSosTriggered(true);
    }

    // Check for alert stage at 70%
    if (newScore >= 70 && stage !== STAGE.ALERT) {
      setStage(STAGE.ALERT);
    }

    // Check for kill at 95%
    if (newScore >= 95) {
      setTimeout(() => setStage(STAGE.KILL_CALL), 1200);
      setTimeout(() => setStage(STAGE.RECEIPT), 4200);
      return;
    }

    // Schedule next line
    timerRef.current = setTimeout(() => {
      advanceLine(lineIdx + 1, newScore);
    }, line.delay);
  }, [scenario, stage, sosTriggered]);

  // ─── Start simulation ───
  const startSimulation = () => {
    resetSimulation();
    setStage(STAGE.INCOMING);

    // After 3s ring, auto-answer
    timerRef.current = setTimeout(() => {
      setStage(STAGE.CONNECTED);

      // Brief connection pause, then start streaming
      timerRef.current = setTimeout(() => {
        setStage(STAGE.STREAMING);
        advanceLine(0, 0);
      }, 1500);
    }, 3000);
  };

  // ─── Reset to idle ───
  const resetSimulation = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage(STAGE.IDLE);
    setVisibleLines([]);
    setThreatScore(0);
    setCurrentLineIdx(0);
    setSosTriggered(false);
  };

  // ─── Render PII-redacted text ───
  const renderLineText = (line) => {
    if (!line.pii || line.pii.length === 0) return line.text;

    let result = line.text;
    const parts = [];
    let lastIndex = 0;

    line.pii.forEach(({ raw, redacted }) => {
      const idx = result.indexOf(raw, lastIndex);
      if (idx !== -1) {
        if (idx > lastIndex) parts.push(result.substring(lastIndex, idx));
        parts.push(
          <span key={raw} className={styles.redactedPii}>
            <span className={styles.piiOriginal}>{raw}</span>
            <span className={styles.piiMask}>{redacted}</span>
          </span>
        );
        lastIndex = idx + raw.length;
      }
    });

    if (lastIndex < result.length) parts.push(result.substring(lastIndex));
    return parts.length > 0 ? parts : result;
  };

  // ─── Determine mockup border state ───
  const getMockupState = () => {
    switch (stage) {
      case STAGE.INCOMING: return 'ringing';
      case STAGE.ALERT: return 'alarm';
      case STAGE.KILL_CALL: return 'disconnected';
      case STAGE.RECEIPT: return 'secure';
      default: return 'idle';
    }
  };

  // ─── Threat meter color ───
  const getThreatColor = () => {
    if (threatScore >= 90) return 'var(--color-scam-red)';
    if (threatScore >= 65) return 'var(--color-scam-orange)';
    if (threatScore >= 40) return '#eab308';
    return 'var(--color-safety-green)';
  };

  const isRunning = stage !== STAGE.IDLE;

  return (
    <section id="demo" className={styles.section}>
      <div className={`${styles.container} section-wrapper`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Interactive Scam Simulator</h2>
          <p className={styles.subtitle}>
            Experience how CallShield detects, escalates, and forcefully terminates a live scam call in real-time.
          </p>
        </div>

        <div className={styles.simulatorGrid}>
          {/* ── Left: Control Panel ── */}
          <div className={styles.controlPanel}>
            {/* Scenario Picker */}
            <div className={styles.scenarioSection}>
              <h3 className={styles.panelLabel}>Select Scenario</h3>
              <div className={styles.scenarioButtons}>
                {scenarioKeys.map((key) => (
                  <button
                    key={key}
                    className={`${styles.scenarioBtn} ${selectedScenario === key ? styles.scenarioBtnActive : ''}`}
                    onClick={() => { if (!isRunning) setSelectedScenario(key); }}
                    disabled={isRunning}
                  >
                    <span className={styles.scenarioEmoji}>{scenarios[key].caller.avatar}</span>
                    <span>{scenarios[key].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className={styles.actionSection}>
              {!isRunning ? (
                <button className={`btn btn-primary ${styles.actionBtn}`} onClick={startSimulation}>
                  <Play size={20} />
                  Simulate Call Session
                </button>
              ) : (
                <button className={`btn btn-secondary ${styles.actionBtn}`} onClick={resetSimulation}>
                  <RotateCcw size={20} />
                  Reset Simulation
                </button>
              )}
            </div>

            {/* Threat Meter */}
            <div className={styles.meterSection}>
              <h3 className={styles.panelLabel}>Threat Analysis</h3>
              <div className={styles.meterContainer}>
                <div className={styles.meterTrack}>
                  <div
                    className={styles.meterFill}
                    style={{
                      width: `${threatScore}%`,
                      backgroundColor: getThreatColor(),
                      boxShadow: `0 0 12px ${getThreatColor()}`,
                    }}
                  ></div>
                </div>
                <div className={styles.meterValue} style={{ color: getThreatColor() }}>
                  {threatScore}%
                </div>
              </div>
              <div className={styles.meterLabel}>
                {threatScore < 40 && '🟢 Low Risk'}
                {threatScore >= 40 && threatScore < 65 && '🟡 Suspicious'}
                {threatScore >= 65 && threatScore < 90 && '🟠 High Risk — SOS Triggered'}
                {threatScore >= 90 && '🔴 Critical — Grandma Mode Active'}
              </div>
            </div>

            {/* SOS Notification */}
            {sosTriggered && (
              <div className={styles.sosAlert}>
                <MessageSquareWarning size={20} />
                <div>
                  <strong>SOS SMS Dispatched</strong>
                  <p>Emergency contact notified via background SMS.</p>
                </div>
              </div>
            )}

            {/* Stage Indicator */}
            <div className={styles.stageSection}>
              <h3 className={styles.panelLabel}>Engine Status</h3>
              <div className={styles.stageIndicator}>
                <span className={`${styles.stageDot} ${isRunning ? styles.stageDotActive : ''}`}></span>
                <span className={styles.stageText}>
                  {stage === STAGE.IDLE && 'Awaiting operator command...'}
                  {stage === STAGE.INCOMING && 'Incoming call detected...'}
                  {stage === STAGE.CONNECTED && 'Call connected. Initializing STT...'}
                  {stage === STAGE.STREAMING && 'Transcribing & analyzing...'}
                  {stage === STAGE.ALERT && '⚠️ High threat — monitoring escalated'}
                  {stage === STAGE.KILL_CALL && '🚨 KILL_CALL dispatched'}
                  {stage === STAGE.RECEIPT && '✅ Threat neutralized.'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Phone Mockup ── */}
          <div className={styles.mockupCol}>
            <PhoneMockup statusState={getMockupState()}>
              {/* ─ IDLE Screen ─ */}
              {stage === STAGE.IDLE && (
                <div className={styles.idleScreen}>
                  <div className={styles.idleRadar}>
                    <div className={styles.idlePulse1}></div>
                    <div className={styles.idlePulse2}></div>
                    <div className={styles.idleCore}>
                      <Shield size={36} />
                    </div>
                  </div>
                  <h3 className={styles.idleTitle}>Monitoring Active</h3>
                  <p className={styles.idleSubtitle}>Awaiting incoming call...</p>
                </div>
              )}

              {/* ─ INCOMING Screen ─ */}
              {stage === STAGE.INCOMING && (
                <div className={styles.incomingScreen}>
                  <p className={styles.incomingLabel}>Incoming Call</p>
                  <div className={styles.callerAvatar}>{scenario.caller.avatar}</div>
                  <h3 className={styles.callerName}>{scenario.caller.name}</h3>
                  <p className={styles.callerNumber}>{scenario.caller.number}</p>
                  <div className={styles.callActions}>
                    <div className={`${styles.callBtn} ${styles.callBtnDecline}`}>
                      <PhoneOff size={22} />
                    </div>
                    <div className={`${styles.callBtn} ${styles.callBtnAccept}`}>
                      <Phone size={22} />
                    </div>
                  </div>
                </div>
              )}

              {/* ─ CONNECTED Screen ─ */}
              {stage === STAGE.CONNECTED && (
                <div className={styles.connectedScreen}>
                  <p className={styles.connectedLabel}>Connected</p>
                  <div className={styles.callerAvatar}>{scenario.caller.avatar}</div>
                  <h3 className={styles.callerName}>{scenario.caller.name}</h3>
                  <div className={styles.waveContainer}>
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={styles.waveBar}
                        style={{ animationDelay: `${i * 0.12}s` }}
                      ></div>
                    ))}
                  </div>
                  <p className={styles.connectedStatus}>Initializing speech engine...</p>
                </div>
              )}

              {/* ─ STREAMING / ALERT Screen ─ */}
              {(stage === STAGE.STREAMING || stage === STAGE.ALERT) && (
                <div className={styles.streamingScreen}>
                  {/* Mini header */}
                  <div className={styles.streamHeader}>
                    <div className={styles.streamCaller}>
                      <span>{scenario.caller.avatar}</span>
                      <span className={styles.streamCallerName}>{scenario.caller.name}</span>
                    </div>
                    <div className={styles.streamThreat} style={{ color: getThreatColor() }}>
                      {threatScore}%
                    </div>
                  </div>

                  {/* SOS banner */}
                  {sosTriggered && (
                    <div className={styles.sosBanner}>
                      <AlertTriangle size={14} />
                      <span>SOS Alert sent to emergency contact</span>
                    </div>
                  )}

                  {/* Transcript */}
                  <div className={styles.transcriptArea} ref={transcriptAreaRef}>
                    {visibleLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`${styles.transcriptLine} ${
                          line.speaker === 'scammer' ? styles.lineScammer :
                          line.speaker === 'victim' ? styles.lineVictim :
                          styles.lineSystem
                        }`}
                      >
                        <span className={styles.lineSpeaker}>
                          {line.speaker === 'scammer' ? '🗣️ Caller' :
                           line.speaker === 'victim' ? '👤 You' :
                           '🛡️ System'}
                        </span>
                        <span className={styles.lineText}>{renderLineText(line)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Audio wave footer */}
                  <div className={styles.streamFooter}>
                    <div className={styles.miniWaves}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={styles.miniBar} style={{ animationDelay: `${i * 0.15}s` }}></div>
                      ))}
                    </div>
                    <span className={styles.streamTime}>LIVE</span>
                  </div>
                </div>
              )}

              {/* ─ KILL_CALL Screen ─ */}
              {stage === STAGE.KILL_CALL && (
                <div className={styles.killScreen}>
                  <PhoneOff size={56} className={styles.killIcon} />
                  <h3 className={styles.killTitle}>CALL TERMINATED</h3>
                  <p className={styles.killSubtitle}>Grandma Mode engaged.<br/>Native disconnect executed.</p>
                  <div className={styles.killCode}>KILL_CALL → TelecomManager.endCall()</div>
                </div>
              )}

              {/* ─ RECEIPT Screen ─ */}
              {stage === STAGE.RECEIPT && (
                <div className={styles.receiptScreen}>
                  <div className={styles.receiptBadge}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className={styles.receiptTitle}>Threat Neutralized</h3>

                  <div className={styles.receiptCard}>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Caller ID</span>
                      <span className={styles.receiptValue}>{scenario.caller.name}</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Threat Level</span>
                      <span className={styles.receiptValueDanger}>{threatScore}% (Critical)</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Action Taken</span>
                      <span className={styles.receiptValue}>Forced Disconnect</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>SOS SMS</span>
                      <span className={styles.receiptValueGreen}>Delivered ✓</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>FIR Report</span>
                      <span className={styles.receiptValueGreen}>Generated ✓</span>
                    </div>
                  </div>

                  <div className={styles.receiptFooter}>
                    <FileText size={14} />
                    <span>Full forensic PDF saved to device.</span>
                  </div>
                </div>
              )}
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScamSimulator;
