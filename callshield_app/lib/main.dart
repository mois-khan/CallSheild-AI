import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/alert_service.dart';
import 'services/storage_service.dart';
import 'history_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CallShield-AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Applying our "Midnight Neural" Theme globally
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1), // Electric Indigo
          surface: Color(0xFF1E293B),
        ),
      ),
      home: const AlertScreen(),
    );
  }
}

class AlertScreen extends StatefulWidget {
  const AlertScreen({super.key});

  @override
  State<AlertScreen> createState() => _AlertScreenState();
}

class _AlertScreenState extends State<AlertScreen> {
  final AlertService _alertService = AlertService();
  final StorageService _storageService = StorageService();
  final String currentNgrokUrl = "https://concavely-inflationary-eddy.ngrok-free.dev"; // 🚨 UPDATE THIS

  bool _isMinimized = false;
  String _lastSavedExplanation = ""; // Prevents saving duplicates on UI rebuilds

  @override
  void initState() {
    super.initState();
    _alertService.connect(currentNgrokUrl);
  }

  @override
  void dispose() {
    _alertService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CallShield-AI', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Color(0xFF6366F1)),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const HistoryScreen()),
              );
            },
          )
        ],
      ),
      body: StreamBuilder<Map<String, dynamic>>(
        stream: _alertService.alertStream,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)));
          }

          final payload = snapshot.data!;

          // SAFE STATE
          if (payload['type'] == 'SYSTEM') {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.security, color: Color(0xFF6366F1), size: 100), // Neural Shield vibe
                  const SizedBox(height: 20),
                  Text(payload['message'] ?? 'Monitoring Active',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF6366F1))),
                ],
              ),
            );
          }

          // ALERT STATE
          if (payload['type'] == 'ALERT') {
            bool isCritical = payload['threatLevel'] == 'CRITICAL';
            Color warningColor = isCritical ? const Color(0xFFEF4444) : const Color(0xFFF59E0B);

            // Save to local storage (Only if it's a new alert to prevent duplicates)
            if (_lastSavedExplanation != payload['explanation']) {
              _storageService.saveAlert(payload);
              _lastSavedExplanation = payload['explanation'];
            }

            if (_isMinimized) {
              return Column(
                children: [
                  Container(
                    width: double.infinity,
                    color: warningColor,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Icon(Icons.warning_amber_rounded, color: Colors.white),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            isCritical ? 'CRITICAL THREAT (Tap to expand)' : 'SUSPICIOUS (Tap to expand)',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.open_in_full, color: Colors.white),
                          onPressed: () => setState(() => _isMinimized = false),
                        )
                      ],
                    ),
                  ),
                  const Expanded(
                    child: Center(
                      child: Text("App is minimized. Monitoring active.",
                          style: TextStyle(color: Colors.grey)),
                    ),
                  )
                ],
              );
            }

            return Container(
              width: double.infinity,
              color: warningColor,
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Align(
                    alignment: Alignment.topRight,
                    child: IconButton(
                      icon: const Icon(Icons.close_fullscreen, color: Colors.white, size: 30),
                      onPressed: () => setState(() => _isMinimized = true),
                    ),
                  ),
                  const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 100),
                  const SizedBox(height: 20),
                  Text(
                    isCritical ? 'CRITICAL THREAT DETECTED' : 'SUSPICIOUS CALLER',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A), // Dark slate inside the red
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Text('Scam Probability: ${payload['probability']}%',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 10),
                          child: Divider(color: Colors.white24),
                        ),
                        Text('${payload['explanation']}',
                            style: const TextStyle(fontSize: 16, color: Colors.white70), textAlign: TextAlign.center),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}