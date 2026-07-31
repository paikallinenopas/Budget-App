import 'package:flutter/material.dart';

import 'theme/app_theme.dart';
import 'screens/home_page.dart';

void main() {
  runApp(const FineroApp());
}

class FineroApp extends StatelessWidget {
  const FineroApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FINERO',

      debugShowCheckedModeBanner: false,

      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,

      themeMode: ThemeMode.system,

      home: const HomePage(),
    );
  }
}