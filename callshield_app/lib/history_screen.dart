import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/storage_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final StorageService _storageService = StorageService();
  List<Map<String, dynamic>> _alerts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final alerts = await _storageService.getAlertHistory();
    setState(() {
      _alerts = alerts;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Midnight Slate Background
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: Text(
          'Threat Dashboard',
          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep, color: Colors.grey),
            onPressed: () async {
              await _storageService.clearHistory();
              _loadHistory();
            },
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
          : _alerts.isEmpty
          ? Center(
        child: Text(
          "No threats detected yet.\nYou are secure.",
          textAlign: TextAlign.center,
          style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 16),
        ),
      )
          : ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _alerts.length,
        itemBuilder: (context, index) {
          final alert = _alerts[index];
          final isCritical = alert['threatLevel'] == 'CRITICAL';
          final color = isCritical ? const Color(0xFFEF4444) : const Color(0xFFF59E0B);

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B), // Lighter Slate Card
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: color.withOpacity(0.3), width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.warning_rounded, color: color, size: 24),
                        const SizedBox(width: 8),
                        Text(
                          isCritical ? 'CRITICAL THREAT' : 'SUSPICIOUS',
                          style: GoogleFonts.plusJakartaSans(
                            color: color,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '${alert['probability']}% Match',
                      style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(color: Colors.white12),
                ),
                Text(
                  alert['explanation'] ?? 'No details provided.',
                  style: GoogleFonts.plusJakartaSans(color: const Color(0xFF94A3B8), fontSize: 14),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}