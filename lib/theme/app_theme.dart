import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorSchemeSeed: AppColors.primary,
    scaffoldBackgroundColor: AppColors.backgroundLight,

    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
    ),

    cardTheme: const CardThemeData(
      elevation: 2,
      margin: EdgeInsets.all(12),
    ),
  );


  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorSchemeSeed: AppColors.primary,
    scaffoldBackgroundColor: AppColors.backgroundDark,

    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
    ),

    cardTheme: const CardThemeData(
      elevation: 2,
      margin: EdgeInsets.all(12),
    ),
  );
}