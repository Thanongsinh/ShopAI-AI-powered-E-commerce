import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF6366F1);
  static const primaryDark = Color(0xFF4F46E5);
  static const primaryLight = Color(0xFFEEF2FF);
  static const ai = Color(0xFF8B5CF6);
  static const aiLight = Color(0xFFF5F3FF);
  static const sale = Color(0xFFEC4899);
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const danger = Color(0xFFEF4444);
}

class AppTheme {
  static final light = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      primary: AppColors.primary,
    ),
    fontFamily: 'Inter',
    scaffoldBackgroundColor: const Color(0xFFF9FAFB),
  );
}
