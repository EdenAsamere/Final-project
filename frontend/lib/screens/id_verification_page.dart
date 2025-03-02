import 'package:flutter/material.dart';
import 'verification_method_page.dart';

class IdVerificationPage extends StatelessWidget {
  const IdVerificationPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // AppBar with a back arrow
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Big text title
            const Text(
              'ID Verification',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            // Smaller paragraph text
            Text(
              'Please verify your identity by following the steps below. Make sure to have your ID documents ready for the process.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 16),
            // Centered image below the paragraph
            Center(
              child: Image.asset(
                'assets/images/id_verification.png',
                width: 200,
                errorBuilder: (context, error, stackTrace) {
                  return const Text('Image not found!', style: TextStyle(color: Colors.red));
                },
              ),
            ),
            const Spacer(),
            // Verify button at the bottom of the screen
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Navigate to the VerificationMethodPage when tapped
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const VerificationMethodPage()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Verify'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
