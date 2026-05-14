import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/theme.dart';
import 'app/router.dart';

void main() {
  runApp(const ProviderScope(child: ShopAIApp()));
}

class ShopAIApp extends ConsumerWidget {
  const ShopAIApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'ShopAI',
      theme: AppTheme.light,
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
    );
  }
}
