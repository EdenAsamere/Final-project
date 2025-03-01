import 'package:equbapp/blocs/collateral/collateral_bloc.dart';
import 'package:equbapp/blocs/idVerification/idverification_bloc.dart';
import 'package:equbapp/blocs/profile/profile_bloc.dart';
import 'package:equbapp/firebase_options.dart';
import 'package:equbapp/repositories/idVerification_repository.dart';
import 'package:equbapp/screens/idVerificationMethod_screen.dart';
import 'package:equbapp/screens/login_screen.dart';
import 'package:equbapp/screens/profile_screen.dart';
import 'package:equbapp/screens/registeration_screen.dart';
import 'package:equbapp/screens/upload_collaterals_screen.dart';
import 'package:equbapp/screens/verifyIdentity_screen.dart';
import 'package:equbapp/theme/theme.dart';
import 'package:equbapp/widgets/mainScreen.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/blocs/registration/registration_bloc.dart';
import 'package:equbapp/blocs/login/login_bloc.dart';
import 'package:equbapp/repositories/user_repository.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<RegistrationBloc>(
          create: (context) => RegistrationBloc(UserRepository()),
        ),
        BlocProvider<LoginBloc>(
          create: (context) => LoginBloc(UserRepository()),
        ),
        BlocProvider<ProfileBloc>(
          create: (context) => ProfileBloc(UserRepository()),
        ),
        BlocProvider<CollateralBloc>(
          create: (context) => CollateralBloc(UserRepository()),
        ),
        BlocProvider<IdverificationBloc>(
          create: (context) => IdverificationBloc(IdverificationRepository()),
        ),
   
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Equb App',
        theme: AppTheme.lightTheme,
        home: StreamBuilder<User?>(
          stream: FirebaseAuth.instance.authStateChanges(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasData) {
              return const MainScreen();
            } else {
              return  LoginScreen();
            }
          },
        ),
        routes: {
          '/login': (context) => LoginScreen(),
          '/register': (context) =>  RegistrationScreen(),
          '/home': (context) => const MainScreen(),
          '/profile': (context) => ProfileScreen(),
          '/upload-collaterals': (context) => UploadCollateralScreen(),
          '/verify-identity': (context) => const VerifyIdentityScreen(),
          '/id-verification-methods': (context) => const IDVerificationMethodScreen(), 
        },
      ),
    );
  }
}