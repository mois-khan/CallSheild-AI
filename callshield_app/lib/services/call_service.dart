import 'dart:convert';
import 'package:http/http.dart' as http;

class CallService {
  static const String _baseUrl = "https://callshield-ai-backend.onrender.com";

  /// Sends a POST request to the backend to initiate a Twilio call.
  /// The backend will call the hardcoded agent first, then dial [customerNumber].
  /// Returns a result map: { "success": bool, "message": String, "callSid"?: String }
  static Future<Map<String, dynamic>> requestCall(String customerNumber) async {
    try {
      final response = await http.post(
        Uri.parse("$_baseUrl/api/call"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"customerNumber": customerNumber.trim()}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          "success": true,
          "message": "Call initiated successfully!",
          "callSid": data["callSid"],
        };
      } else {
        final data = jsonDecode(response.body);
        return {
          "success": false,
          "message": data["error"] ?? "Server returned ${response.statusCode}",
        };
      }
    } catch (e) {
      return {
        "success": false,
        "message": "Network error: Could not reach the server.",
      };
    }
  }
}
