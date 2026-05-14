import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Skeleton router — buyer/seller shells with bottom nav will be built in Phase 4.
// See CLAUDE.MD for the planned screen tree.
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (_, __) => const _PlaceholderScreen(title: 'ShopAI Mobile'),
    ),
  ],
);

class _PlaceholderScreen extends StatelessWidget {
  final String title;
  const _PlaceholderScreen({required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'Flutter skeleton — screens implemented in Phase 4 of the roadmap.',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
