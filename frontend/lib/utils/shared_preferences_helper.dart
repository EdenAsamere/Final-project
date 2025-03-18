import 'package:shared_preferences/shared_preferences.dart';

class SharedPreferencesHelper {
  // Save the current step of the ID verification process
  static Future<void> saveVerificationStep(String step) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('verification_step', step);
  }

  // Load the saved verification step
  static Future<String?> loadVerificationStep() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('verification_step');
  }

  // Clear the saved verification step (after completion)
  static Future<void> clearVerificationProgress() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('verification_step');
  }
}
