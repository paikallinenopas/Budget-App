import 'package:flutter/material.dart';
import '../widgets/finero_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FINERO'),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [

            const Text(
              'Tervetuloa takaisin',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            FineroCard(
              title: 'Oma talous',
              value: '0 €',
              icon: Icons.account_balance_wallet,
            ),

            FineroCard(
              title: 'Sijoitukset',
              value: '0 €',
              icon: Icons.trending_up,
            ),

            FineroCard(
              title: 'Kuukauden menot',
              value: '0 €',
              icon: Icons.shopping_cart,
            ),

          ],
        ),
      ),
    );
  }
}