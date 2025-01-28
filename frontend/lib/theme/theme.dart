import 'package:equbapp/utils/colors.dart';
import 'package:flutter/material.dart';


class AppTheme {


  // Light Theme
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    fontFamily: 'DefaultFont',
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.white,
    // appBarTheme: AppBarTheme(
    //   color: AppColors.primary,
    //   titleTextStyle: TextStyle(
    //     color: AppColors.textPrimary,
    //     fontSize: 20,
    //     fontWeight: FontWeight.bold,
    //   ),
    // ),
    textTheme: const TextTheme(
     bodyLarge: TextStyle(color: AppColors.primary, fontSize: 16),
      bodyMedium: TextStyle(color: AppColors.secondary, fontSize: 14),
    ),
    buttonTheme: const ButtonThemeData(
      buttonColor: AppColors.primary, // Button background color
      textTheme: ButtonTextTheme.primary,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: AppColors.white,
         backgroundColor: AppColors.primary,
      ),
    ), 
    
  );

  // Dark Theme
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    fontFamily: 'DefaultFont',
    primaryColor: AppColors.primary,
    scaffoldBackgroundColor: AppColors.darkBackground,
    // appBarTheme: AppBarTheme(
    //   color: AppColors.darkBackground,
    //   titleTextStyle: TextStyle(
    //     color: AppColors.primary,
    //     fontSize: 20,
    //     fontWeight: FontWeight.bold,
    //   ),
    // ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(color: AppColors.primary, fontSize: 16),
      bodyMedium: TextStyle(color: AppColors.secondary, fontSize: 14),
    ),
    buttonTheme: ButtonThemeData(
      buttonColor: AppColors.primary,
      textTheme: ButtonTextTheme.primary,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: AppColors.white,
         backgroundColor: AppColors.secondary,
      ),
    ),
  );
}
