import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ─── Scenario Data ───
class _ScenarioLine {
  final String speaker; // 'scammer', 'victim', 'system'
  final String text;
  final int threatBump;
  final int delayMs;
  final String? piiRaw;
  final String? piiMask;

  const _ScenarioLine({
    required this.speaker,
    required this.text,
    required this.threatBump,
    required this.delayMs,
    this.piiRaw,
    this.piiMask,
  });
}

class _Scenario {
  final String id;
  final String label;
  final String callerName;
  final String callerNumber;
  final IconData icon;
  final List<_ScenarioLine> transcript;

  const _Scenario({
    required this.id,
    required this.label,
    required this.callerName,
    required this.callerNumber,
    required this.icon,
    required this.transcript,
  });
}

final List<_Scenario> _scenarios = [
  _Scenario(
    id: 'fedex',
    label: 'FedEx Customs Scam',
    callerName: 'FedEx Customs Alert',
    callerNumber: '+91 98XX XXX 431',
    icon: Icons.local_shipping_outlined,
    transcript: [
      const _ScenarioLine(speaker: 'scammer', text: 'Hello, this is calling from FedEx International Logistics. Am I speaking to the account holder?', threatBump: 5, delayMs: 2200),
      const _ScenarioLine(speaker: 'victim', text: 'Yes, who is this?', threatBump: 0, delayMs: 1500),
      const _ScenarioLine(speaker: 'scammer', text: 'Sir, a parcel registered under your Aadhaar number 8432-XXXX-7291 has been intercepted at Mumbai customs.', threatBump: 15, delayMs: 2800, piiRaw: '8432-XXXX-7291', piiMask: '████-████-████'),
      const _ScenarioLine(speaker: 'system', text: '[PII SCRUBBER] Aadhaar pattern detected and redacted locally.', threatBump: 0, delayMs: 1200),
      const _ScenarioLine(speaker: 'scammer', text: 'The parcel contains 5 forged passports and 200 grams of illegal narcotics. This is a very serious criminal offence.', threatBump: 20, delayMs: 3000),
      const _ScenarioLine(speaker: 'victim', text: 'What? I never sent any parcel! There must be a mistake.', threatBump: 0, delayMs: 1800),
      const _ScenarioLine(speaker: 'scammer', text: 'Your case has been registered with the Narcotics Bureau. I am now connecting you to a senior CBI officer.', threatBump: 25, delayMs: 3200),
      const _ScenarioLine(speaker: 'system', text: '⚠️ [AI BRAIN] Authority impersonation detected. Threat score escalating.', threatBump: 0, delayMs: 1000),
      const _ScenarioLine(speaker: 'scammer', text: 'If you do not cooperate, an arrest warrant will be issued within 30 minutes. Do NOT disconnect this call.', threatBump: 20, delayMs: 2800),
      const _ScenarioLine(speaker: 'scammer', text: 'To verify your identity, please confirm your credit card number ending with 4829 right now.', threatBump: 10, delayMs: 2500, piiRaw: '4829', piiMask: '████'),
      const _ScenarioLine(speaker: 'system', text: '🚨 [GRANDMA MODE] Threat threshold breached. Initiating forced call disconnect.', threatBump: 5, delayMs: 1500),
    ],
  ),
  _Scenario(
    id: 'trai',
    label: 'TRAI Digital Arrest',
    callerName: 'TRAI Compliance Dept.',
    callerNumber: '+91 11-XXXX-3390',
    icon: Icons.cell_tower,
    transcript: [
      const _ScenarioLine(speaker: 'scammer', text: 'This is an automated message from TRAI. Your mobile number will be disconnected in 2 hours.', threatBump: 10, delayMs: 3000),
      const _ScenarioLine(speaker: 'scammer', text: 'Press 1 to speak to a TRAI officer. This is your final notice.', threatBump: 5, delayMs: 2000),
      const _ScenarioLine(speaker: 'victim', text: 'Hello? What is happening to my number?', threatBump: 0, delayMs: 1500),
      const _ScenarioLine(speaker: 'scammer', text: 'Sir, your number has been flagged for sending 847 fraudulent SMS messages. An FIR has been registered against your PAN card ABCPK1234R.', threatBump: 20, delayMs: 3200, piiRaw: 'ABCPK1234R', piiMask: '██████████'),
      const _ScenarioLine(speaker: 'system', text: '[PII SCRUBBER] PAN card pattern detected and redacted locally.', threatBump: 0, delayMs: 1200),
      const _ScenarioLine(speaker: 'scammer', text: 'You are now under a digital arrest. Do NOT leave your house or contact anyone. We are monitoring your location.', threatBump: 25, delayMs: 3000),
      const _ScenarioLine(speaker: 'system', text: '⚠️ [AI BRAIN] "Digital arrest" coercion phrase matched. High-confidence scam pattern.', threatBump: 0, delayMs: 1200),
      const _ScenarioLine(speaker: 'scammer', text: 'To clear your name, transfer a security deposit of ₹2,50,000 to the Supreme Court escrow account immediately.', threatBump: 20, delayMs: 3000),
      const _ScenarioLine(speaker: 'victim', text: 'Two and a half lakhs? I don\'t have that kind of money...', threatBump: 0, delayMs: 1800),
      const _ScenarioLine(speaker: 'scammer', text: 'If you refuse, armed officers will arrive at your residence within 45 minutes. Send the OTP 739214 now.', threatBump: 15, delayMs: 3200, piiRaw: '739214', piiMask: '██████'),
      const _ScenarioLine(speaker: 'system', text: '🚨 [GRANDMA MODE] Threat threshold breached. Initiating forced call disconnect.', threatBump: 5, delayMs: 1500),
    ],
  ),
];

// ─── Stage Constants ───
enum _Stage { idle, incoming, connected, streaming, alert, killCall, receipt }

class DemoScreen extends StatefulWidget {
  const DemoScreen({super.key});

  @override
  State<DemoScreen> createState() => _DemoScreenState();
}

class _DemoScreenState extends State<DemoScreen> with SingleTickerProviderStateMixin {
  int _selectedScenario = 0;
  _Stage _stage = _Stage.idle;
  final List<_ScenarioLine> _visibleLines = [];
  int _threatScore = 0;
  bool _sosTriggered = false;
  Timer? _timer;
  final ScrollController _scrollController = ScrollController();

  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat(reverse: true);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulseController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  _Scenario get _scenario => _scenarios[_selectedScenario];

  void _startSimulation() {
    _resetSimulation();
    setState(() => _stage = _Stage.incoming);

    _timer = Timer(const Duration(seconds: 3), () {
      if (!mounted) return;
      setState(() => _stage = _Stage.connected);

      _timer = Timer(const Duration(milliseconds: 1500), () {
        if (!mounted) return;
        setState(() => _stage = _Stage.streaming);
        _advanceLine(0, 0);
      });
    });
  }

  void _advanceLine(int idx, int currentScore) {
    if (!mounted) return;
    final lines = _scenario.transcript;
    if (idx >= lines.length) {
      _timer = Timer(const Duration(milliseconds: 800), () {
        if (!mounted) return;
        setState(() => _stage = _Stage.killCall);
        _timer = Timer(const Duration(seconds: 3), () {
          if (!mounted) return;
          setState(() => _stage = _Stage.receipt);
        });
      });
      return;
    }

    final line = lines[idx];
    final newScore = (currentScore + line.threatBump).clamp(0, 100);

    setState(() {
      _visibleLines.add(line);
      _threatScore = newScore;
      if (newScore >= 65 && !_sosTriggered) _sosTriggered = true;
      if (newScore >= 70 && _stage != _Stage.alert) _stage = _Stage.alert;
    });

    _scrollToBottom();

    if (newScore >= 95) {
      _timer = Timer(const Duration(milliseconds: 1200), () {
        if (!mounted) return;
        setState(() => _stage = _Stage.killCall);
        _timer = Timer(const Duration(seconds: 3), () {
          if (!mounted) return;
          setState(() => _stage = _Stage.receipt);
        });
      });
      return;
    }

    _timer = Timer(Duration(milliseconds: line.delayMs), () {
      _advanceLine(idx + 1, newScore);
    });
  }

  void _resetSimulation() {
    _timer?.cancel();
    setState(() {
      _stage = _Stage.idle;
      _visibleLines.clear();
      _threatScore = 0;
      _sosTriggered = false;
    });
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Color get _threatColor {
    if (_threatScore >= 90) return const Color(0xFFEF4444);
    if (_threatScore >= 65) return const Color(0xFFF97316);
    if (_threatScore >= 40) return const Color(0xFFEAB308);
    return const Color(0xFF10B981);
  }

  String get _statusText {
    switch (_stage) {
      case _Stage.idle: return 'Tap "Start Simulation" below';
      case _Stage.incoming: return 'Incoming call detected...';
      case _Stage.connected: return 'Initializing speech engine...';
      case _Stage.streaming: return 'Transcribing & analyzing...';
      case _Stage.alert: return '⚠️ High threat — monitoring escalated';
      case _Stage.killCall: return '🚨 KILL_CALL dispatched';
      case _Stage.receipt: return '✅ Threat neutralized.';
    }
  }

  bool get _isRunning => _stage != _Stage.idle;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text("Interactive Demo", style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ── Threat Meter ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: _threatColor.withOpacity(0.4)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("THREAT ANALYSIS", style: GoogleFonts.plusJakartaSans(color: Colors.grey[400], fontSize: 11, letterSpacing: 1.5, fontWeight: FontWeight.bold)),
                        Text("$_threatScore%", style: GoogleFonts.firaCode(color: _threatColor, fontSize: 22, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: _threatScore / 100,
                        minHeight: 8,
                        backgroundColor: Colors.black26,
                        valueColor: AlwaysStoppedAnimation<Color>(_threatColor),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        if (_sosTriggered) ...[
                          const Icon(Icons.warning_amber, color: Color(0xFFF97316), size: 14),
                          const SizedBox(width: 4),
                          Text("SOS SMS Dispatched", style: GoogleFonts.plusJakartaSans(color: const Color(0xFFF97316), fontSize: 11, fontWeight: FontWeight.bold)),
                          const Spacer(),
                        ],
                        Expanded(
                          child: Text(
                            _statusText,
                            style: GoogleFonts.firaCode(color: Colors.grey[500], fontSize: 10),
                            textAlign: TextAlign.right,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // ── Main Content ──
            Expanded(
              child: _buildStageContent(),
            ),

            // ── Bottom Controls ──
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Scenario Picker
                  if (!_isRunning)
                    Row(
                      children: List.generate(_scenarios.length, (i) {
                        final s = _scenarios[i];
                        final isActive = _selectedScenario == i;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedScenario = i),
                            child: Container(
                              margin: EdgeInsets.only(right: i < _scenarios.length - 1 ? 8 : 0),
                              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                              decoration: BoxDecoration(
                                color: isActive ? const Color(0xFF6366F1).withOpacity(0.12) : const Color(0xFF1E293B),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: isActive ? const Color(0xFF6366F1) : Colors.white.withOpacity(0.05)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(s.icon, color: isActive ? const Color(0xFF6366F1) : Colors.grey, size: 16),
                                  const SizedBox(width: 6),
                                  Flexible(
                                    child: Text(
                                      s.label,
                                      style: GoogleFonts.plusJakartaSans(color: isActive ? Colors.white : Colors.grey[500], fontSize: 11, fontWeight: FontWeight.bold),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ),
                  const SizedBox(height: 12),

                  // Action Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isRunning ? const Color(0xFF1E293B) : const Color(0xFF6366F1),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _isRunning ? _resetSimulation : _startSimulation,
                      icon: Icon(_isRunning ? Icons.replay : Icons.play_arrow, size: 22),
                      label: Text(
                        _isRunning ? "Reset Simulation" : "Start Simulation",
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStageContent() {
    switch (_stage) {
      case _Stage.idle:
        return _buildIdleScreen();
      case _Stage.incoming:
        return _buildIncomingScreen();
      case _Stage.connected:
        return _buildConnectedScreen();
      case _Stage.streaming:
      case _Stage.alert:
        return _buildStreamingScreen();
      case _Stage.killCall:
        return _buildKillScreen();
      case _Stage.receipt:
        return _buildReceiptScreen();
    }
  }

  // ── IDLE ──
  Widget _buildIdleScreen() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Transform.scale(
                scale: 1.0 + (_pulseController.value * 0.1),
                child: Container(
                  width: 100, height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFF6366F1).withOpacity(0.12),
                    border: Border.all(color: const Color(0xFF6366F1), width: 2),
                    boxShadow: [BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.2), blurRadius: 30)],
                  ),
                  child: const Icon(Icons.security, color: Color(0xFF6366F1), size: 44),
                ),
              );
            },
          ),
          const SizedBox(height: 20),
          Text("Monitoring Active", style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text("Select a scenario and start the simulation", style: GoogleFonts.plusJakartaSans(color: Colors.grey[500], fontSize: 13)),
        ],
      ),
    );
  }

  // ── INCOMING ──
  Widget _buildIncomingScreen() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text("Incoming Call", style: GoogleFonts.plusJakartaSans(color: Colors.grey[500], fontSize: 12, letterSpacing: 2, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          Icon(_scenario.icon, color: const Color(0xFF6366F1), size: 56),
          const SizedBox(height: 16),
          Text(_scenario.callerName, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(_scenario.callerNumber, style: GoogleFonts.firaCode(color: Colors.grey[600], fontSize: 13)),
          const SizedBox(height: 40),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildCallBtn(Icons.call_end, const Color(0xFFEF4444)),
              const SizedBox(width: 48),
              _buildCallBtn(Icons.call, const Color(0xFF10B981)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCallBtn(IconData icon, Color color) {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, _) {
        return Container(
          width: 56, height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color,
            boxShadow: [BoxShadow(color: color.withOpacity(0.3 + _pulseController.value * 0.2), blurRadius: 20)],
          ),
          child: Icon(icon, color: Colors.white, size: 26),
        );
      },
    );
  }

  // ── CONNECTED ──
  Widget _buildConnectedScreen() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text("Connected", style: GoogleFonts.plusJakartaSans(color: const Color(0xFF10B981), fontSize: 12, letterSpacing: 2, fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          Icon(_scenario.icon, color: const Color(0xFF6366F1), size: 48),
          const SizedBox(height: 12),
          Text(_scenario.callerName, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          // Wave bars
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(7, (i) {
              return AnimatedBuilder(
                animation: _pulseController,
                builder: (context, _) {
                  final h = 12.0 + (_pulseController.value * 20) * ((i % 3 == 0) ? 1.0 : 0.6);
                  return Container(
                    width: 4, height: h,
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    decoration: BoxDecoration(color: const Color(0xFF6366F1), borderRadius: BorderRadius.circular(2)),
                  );
                },
              );
            }),
          ),
          const SizedBox(height: 16),
          Text("Initializing speech engine...", style: GoogleFonts.firaCode(color: Colors.grey[600], fontSize: 12)),
        ],
      ),
    );
  }

  // ── STREAMING / ALERT ──
  Widget _buildStreamingScreen() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Caller header
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Icon(_scenario.icon, size: 16, color: Colors.grey[500]),
                const SizedBox(width: 6),
                Text(_scenario.callerName, style: GoogleFonts.plusJakartaSans(color: Colors.grey[400], fontSize: 12, fontWeight: FontWeight.w600)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFEF4444).withOpacity(0.15), borderRadius: BorderRadius.circular(6)),
                  child: Text("LIVE", style: GoogleFonts.firaCode(color: const Color(0xFFEF4444), fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.white10, height: 1),

          // Transcript
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: _visibleLines.length,
              itemBuilder: (context, index) {
                final line = _visibleLines[index];
                return _buildTranscriptBubble(line);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTranscriptBubble(_ScenarioLine line) {
    Color bgColor;
    Color borderColor;
    String speakerLabel;

    switch (line.speaker) {
      case 'scammer':
        bgColor = const Color(0xFFEF4444).withOpacity(0.06);
        borderColor = const Color(0xFFEF4444).withOpacity(0.3);
        speakerLabel = '🗣️ CALLER';
        break;
      case 'victim':
        bgColor = Colors.white.withOpacity(0.03);
        borderColor = Colors.white.withOpacity(0.1);
        speakerLabel = '👤 YOU';
        break;
      default:
        bgColor = const Color(0xFF6366F1).withOpacity(0.06);
        borderColor = const Color(0xFF6366F1).withOpacity(0.3);
        speakerLabel = '🛡️ SYSTEM';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10),
        border: Border(left: BorderSide(color: borderColor, width: 2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(speakerLabel, style: GoogleFonts.plusJakartaSans(color: Colors.grey[600], fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
          const SizedBox(height: 3),
          _buildLineText(line),
        ],
      ),
    );
  }

  Widget _buildLineText(_ScenarioLine line) {
    if (line.piiRaw == null) {
      return Text(line.text, style: GoogleFonts.plusJakartaSans(color: Colors.grey[300], fontSize: 12.5, height: 1.4));
    }

    final parts = line.text.split(line.piiRaw!);
    return RichText(
      text: TextSpan(
        style: GoogleFonts.plusJakartaSans(color: Colors.grey[300], fontSize: 12.5, height: 1.4),
        children: [
          if (parts.isNotEmpty) TextSpan(text: parts[0]),
          TextSpan(
            text: line.piiRaw,
            style: GoogleFonts.firaCode(color: const Color(0xFFEF4444).withOpacity(0.5), fontSize: 11, decoration: TextDecoration.lineThrough),
          ),
          TextSpan(
            text: " ${line.piiMask}",
            style: GoogleFonts.firaCode(color: const Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold),
          ),
          if (parts.length > 1) TextSpan(text: parts[1]),
        ],
      ),
    );
  }

  // ── KILL CALL ──
  Widget _buildKillScreen() {
    return Center(
      child: AnimatedBuilder(
        animation: _pulseController,
        builder: (context, _) {
          return Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444).withOpacity(0.03 + _pulseController.value * 0.04),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.3)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.call_end, color: const Color(0xFFEF4444), size: 64),
                const SizedBox(height: 16),
                Text("CALL TERMINATED", style: GoogleFonts.plusJakartaSans(color: const Color(0xFFEF4444), fontSize: 20, fontWeight: FontWeight.bold, letterSpacing: 1)),
                const SizedBox(height: 8),
                Text("Grandma Mode engaged.\nNative disconnect executed.", textAlign: TextAlign.center, style: GoogleFonts.plusJakartaSans(color: Colors.grey[400], fontSize: 13)),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.black38, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.white10)),
                  child: Text("KILL_CALL → TelecomManager.endCall()", style: GoogleFonts.firaCode(color: Colors.grey[600], fontSize: 10)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ── RECEIPT ──
  Widget _buildReceiptScreen() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(24),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF1E1E2A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFF10B981), width: 2),
          boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.2), blurRadius: 30)],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.gpp_good_rounded, color: Color(0xFF10B981), size: 48),
            ),
            const SizedBox(height: 16),
            Text("THREAT NEUTRALIZED", style: GoogleFonts.plusJakartaSans(color: const Color(0xFF10B981), fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 1)),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(14)),
              child: Column(
                children: [
                  _receiptRow("Caller ID", _scenario.callerName),
                  const Divider(color: Colors.white10, height: 20),
                  _receiptRow("Threat Level", "$_threatScore% (Critical)", valueColor: const Color(0xFFEF4444)),
                  const Divider(color: Colors.white10, height: 20),
                  _receiptRow("Action Taken", "Forced Disconnect"),
                  const Divider(color: Colors.white10, height: 20),
                  _receiptRow("SOS SMS", "Delivered ✓", valueColor: const Color(0xFF10B981)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _receiptRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(color: Colors.grey[600], fontSize: 12, fontWeight: FontWeight.w600)),
        Flexible(child: Text(value, style: GoogleFonts.plusJakartaSans(color: valueColor ?? Colors.white, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.right, overflow: TextOverflow.ellipsis)),
      ],
    );
  }
}
