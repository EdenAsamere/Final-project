import 'package:equbapp/screens/otp_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneNumberController = TextEditingController();

  Future<void> _submitPhoneNumber( BuildContext context) async {
    // Add phone authentication logic
    String phoneNumber = "+251" +_phoneNumberController.text.trim();
    FirebaseAuth auth = FirebaseAuth.instance;

    await auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (PhoneAuthCredential credential) async{}, 
      verificationFailed: (FirebaseAuthException e) {print(e.message.toString());}, 
      codeSent: (String verificationId, int? resendToken) async{
        // Navigate to OTPScreen
        Navigator.push(context, MaterialPageRoute(builder: (context) => OTPScreen(verificationId: verificationId)));
      },
      codeAutoRetrievalTimeout: (String verificationId) async{},);
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
              child: Text("Phone Authentication"),
            ),
            SizedBox(
              height: 50,
            ),
            Padding(
                padding: EdgeInsets.all(16),
                child: TextFormField(
                  controller: _phoneNumberController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    labelText: "Phone Number",
                  ),
                )),
            SizedBox(
              height: 16,
            ),
            InkWell(
              onTap: () => _submitPhoneNumber(context),
              child: Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Text(
                  "Login",
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
