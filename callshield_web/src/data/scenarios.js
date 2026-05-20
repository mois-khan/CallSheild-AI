/**
 * Scam Call Simulation Scenarios
 * 
 * Each scenario contains a caller profile and a timeline of transcript entries.
 * Each entry specifies:
 *   - speaker: 'scammer' | 'victim' | 'system'
 *   - text: The spoken line
 *   - pii: Optional array of { raw, redacted } objects for PII scrubbing animation
 *   - threatBump: How much to increase the threat score after this line
 *   - delay: Milliseconds to wait before showing the next line
 */

export const scenarios = {
  fedex: {
    id: 'fedex',
    label: 'FedEx Customs Scam',
    caller: {
      name: 'FedEx Customs Alert',
      number: '+91 98XX XXX 431',
      avatar: '📦',
    },
    transcript: [
      {
        speaker: 'scammer',
        text: 'Hello, this is calling from FedEx International Logistics. Am I speaking to the account holder?',
        threatBump: 5,
        delay: 2200,
      },
      {
        speaker: 'victim',
        text: 'Yes, who is this?',
        threatBump: 0,
        delay: 1500,
      },
      {
        speaker: 'scammer',
        text: 'Sir, a parcel registered under your Aadhaar number 8432-XXXX-7291 has been intercepted at Mumbai customs.',
        pii: [{ raw: '8432-XXXX-7291', redacted: '████-████-████' }],
        threatBump: 15,
        delay: 2800,
      },
      {
        speaker: 'system',
        text: '[PII SCRUBBER] Aadhaar pattern detected and redacted locally.',
        threatBump: 0,
        delay: 1200,
      },
      {
        speaker: 'scammer',
        text: 'The parcel contains 5 forged passports and 200 grams of illegal narcotics. This is a very serious criminal offence.',
        threatBump: 20,
        delay: 3000,
      },
      {
        speaker: 'victim',
        text: 'What? I never sent any parcel! There must be a mistake.',
        threatBump: 0,
        delay: 1800,
      },
      {
        speaker: 'scammer',
        text: 'Your case has been registered with the Narcotics Bureau. I am now connecting you to a senior CBI officer for immediate questioning.',
        threatBump: 25,
        delay: 3200,
      },
      {
        speaker: 'system',
        text: '⚠️ [AI BRAIN] Authority impersonation detected. Threat score escalating.',
        threatBump: 0,
        delay: 1000,
      },
      {
        speaker: 'scammer',
        text: 'If you do not cooperate, an arrest warrant will be issued within the next 30 minutes. Do NOT disconnect this call.',
        threatBump: 20,
        delay: 2800,
      },
      {
        speaker: 'scammer',
        text: 'To verify your identity, please confirm your credit card number ending with 4829 right now.',
        pii: [{ raw: '4829', redacted: '████' }],
        threatBump: 10,
        delay: 2500,
      },
      {
        speaker: 'system',
        text: '🚨 [GRANDMA MODE] Threat threshold breached. Initiating forced call disconnect.',
        threatBump: 5,
        delay: 1500,
      },
    ],
  },

  trai: {
    id: 'trai',
    label: 'TRAI Digital Arrest',
    caller: {
      name: 'TRAI Compliance Dept.',
      number: '+91 11-XXXX-3390',
      avatar: '📡',
    },
    transcript: [
      {
        speaker: 'scammer',
        text: 'This is an automated message from the Telecom Regulatory Authority of India. Your mobile number will be disconnected in 2 hours.',
        threatBump: 10,
        delay: 3000,
      },
      {
        speaker: 'scammer',
        text: 'Press 1 to speak to a TRAI officer. This is your final notice.',
        threatBump: 5,
        delay: 2000,
      },
      {
        speaker: 'victim',
        text: 'Hello? What is happening to my number?',
        threatBump: 0,
        delay: 1500,
      },
      {
        speaker: 'scammer',
        text: 'Sir, your number has been flagged for sending 847 fraudulent SMS messages. An FIR has already been registered against your PAN card ABCPK1234R.',
        pii: [{ raw: 'ABCPK1234R', redacted: '██████████' }],
        threatBump: 20,
        delay: 3200,
      },
      {
        speaker: 'system',
        text: '[PII SCRUBBER] PAN card pattern detected and redacted locally.',
        threatBump: 0,
        delay: 1200,
      },
      {
        speaker: 'scammer',
        text: 'You are now under a digital arrest. Do NOT leave your house or contact anyone. We are monitoring your location.',
        threatBump: 25,
        delay: 3000,
      },
      {
        speaker: 'system',
        text: '⚠️ [AI BRAIN] "Digital arrest" coercion phrase matched. High-confidence scam pattern.',
        threatBump: 0,
        delay: 1200,
      },
      {
        speaker: 'scammer',
        text: 'To clear your name, you must transfer a security deposit of ₹2,50,000 to the Supreme Court escrow account immediately.',
        threatBump: 20,
        delay: 3000,
      },
      {
        speaker: 'victim',
        text: 'Two and a half lakhs? I don\'t have that kind of money...',
        threatBump: 0,
        delay: 1800,
      },
      {
        speaker: 'scammer',
        text: 'If you refuse, armed officers will arrive at your residence within 45 minutes for physical arrest. Send the OTP 739214 that you just received.',
        pii: [{ raw: '739214', redacted: '██████' }],
        threatBump: 15,
        delay: 3200,
      },
      {
        speaker: 'system',
        text: '🚨 [GRANDMA MODE] Threat threshold breached. Initiating forced call disconnect.',
        threatBump: 5,
        delay: 1500,
      },
    ],
  },
};

export const scenarioKeys = Object.keys(scenarios);
