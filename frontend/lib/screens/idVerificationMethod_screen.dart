import 'package:equbapp/screens/idUpload_screen.dart';
import 'package:flutter/material.dart';

class IDVerificationMethodScreen extends StatefulWidget {
  const IDVerificationMethodScreen({super.key});

  @override
  State<IDVerificationMethodScreen> createState() => _IDVerificationMethodScreenState();
}

class _IDVerificationMethodScreenState extends State<IDVerificationMethodScreen> {
  String? _selectedMethod;
  final List<String> _verificationMethods = [
    'National ID',
    'Passport',
    'Driver License'
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Verification Method'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Choose your method',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
          
            const SizedBox(height: 16),
            Column(
              children: _verificationMethods.map((method) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: RadioListTile<String>(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    title: Text(method),
                    value: method,
                    groupValue: _selectedMethod,
                    onChanged: (value) {
                      setState(() {
                        _selectedMethod = value;
                      });
                    },
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    tileColor: Colors.grey[200],
                    activeColor: Colors.green,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 40),

            // Continue Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _selectedMethod != null
                    ? () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => IDUploadScreen(
                              selectedMethod: _selectedMethod!,
                            ),
                          ),
                        );
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'Continue',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
