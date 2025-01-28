import 'package:equbapp/firebase_options.dart';
import 'package:equbapp/screens/home_screen.dart';
import 'package:equbapp/screens/login_screen.dart';
import 'package:equbapp/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart'; // Import firebase_auth

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    var auth = FirebaseAuth.instance; // Move FirebaseAuth to build method

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Equb App',
      theme: AppTheme.lightTheme,
      home: auth.currentUser != null ? HomeScreen() : LoginScreen(),
    );
  }
}
