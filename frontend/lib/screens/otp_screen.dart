import 'package:equbapp/screens/home_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class OTPScreen extends StatefulWidget {
  final String verificationId;
  OTPScreen({required this.verificationId});
  @override
  State<OTPScreen> createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
  final TextEditingController _otpNumberController = TextEditingController();
  
  Future<void> _submitOTP( BuildContext context) async {
    // Add phone authentication logic
    String otp = _otpNumberController.text.trim();
    FirebaseAuth auth = FirebaseAuth.instance;

    try {
      PhoneAuthCredential credential = PhoneAuthProvider.credential(
        verificationId: widget.verificationId,
        smsCode: otp,
      );

      await auth.signInWithCredential(credential);
      Navigator.push(context, MaterialPageRoute(builder: (context) => HomeScreen()));
    } catch (e) {
      print(e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Screen'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            SizedBox(
              height: 70,
            ),
            Center(
              child: Text("OTP Authentication"),
            ),
            SizedBox(
              height: 50,
            ),
            Padding(
                padding: EdgeInsets.all(16),
                child: TextFormField(
                  controller: _otpNumberController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    labelText: "Verification Code",
                  ),
                )),
            SizedBox(
              height: 16,
            ),
            InkWell(
              onTap: () => _submitOTP(context),
              child: Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Text(
                  "Verify",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
