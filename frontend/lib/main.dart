import 'package:equbapp/firebase_options.dart';
import 'package:equbapp/screens/home_screen.dart';
import 'package:equbapp/screens/login_screen.dart';
import 'package:equbapp/screens/registeration_screen.dart';
import 'package:equbapp/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/blocs/registration_bloc.dart';
import 'package:equbapp/blocs/login_bloc.dart';
import 'package:equbapp/repositories/user_repository.dart';

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
    var auth = FirebaseAuth.instance;

    return MultiBlocProvider(
      providers: [
        BlocProvider<RegistrationBloc>(
          create: (context) => RegistrationBloc(UserRepository()),
        ),
        BlocProvider<LoginBloc>(
          create: (context) => LoginBloc(UserRepository()),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Equb App',
        theme: AppTheme.lightTheme,
        home: auth.currentUser != null ? HomeScreen() : LoginScreen(),
        routes: {
          '/login': (context) => LoginScreen(),
          '/register': (context) => RegistrationScreen(),
          '/home': (context) => HomeScreen(),
        },
      ),
    );
  }
}