import 'package:flutter/material.dart';

class VerificationMethodPage extends StatefulWidget {
  const VerificationMethodPage({super.key});

  @override
  _VerificationMethodPageState createState() => _VerificationMethodPageState();
}

class _VerificationMethodPageState extends State<VerificationMethodPage> {
  String selectedNationality = 'Ethiopian'; // Default nationality
  String? selectedMethod;
  bool showNationalityOptions = false; // Toggle for dropdown

  final List<Map<String, String>> nationalities = [
    {'name': 'Ethiopian', 'flag': 'assets/images/ethiopia_flag.png'},
    {'name': 'Kenyan', 'flag': 'assets/images/kenya_flag.png'},
    {'name': 'Nigerian', 'flag': 'assets/images/nigeria_flag.png'},
    {'name': 'South African', 'flag': 'assets/images/south_africa_flag.png'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Verification Options"),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: Choose your method
            const Text(
              'Choose your method',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Nationality section
            const Text(
              'Nationality',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),

            // Nationality selection (dropdown)
            GestureDetector(
              onTap: () {
                setState(() {
                  showNationalityOptions = !showNationalityOptions;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F8FF),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue, width: 2),
                ),
                child: Row(
                  children: [
                    _getFlag(selectedNationality, width: 32, height: 20),
                    const SizedBox(width: 8),
                    Text(
                      selectedNationality,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.black),
                    ),
                    const Spacer(),
                    const Icon(Icons.arrow_drop_down, color: Colors.blue),
                  ],
                ),
              ),
            ),

            if (showNationalityOptions)
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)],
                ),
                child: Column(
                  children: nationalities.map((nationality) {
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedNationality = nationality['name']!;
                          showNationalityOptions = false;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                        decoration: BoxDecoration(
                          color: selectedNationality == nationality['name'] ? Colors.blue[100] : Colors.white,
                        ),
                        child: Row(
                          children: [
                            _getFlag(nationality['name']!, width: 24, height: 15),
                            const SizedBox(width: 8),
                            Text(
                              nationality['name']!,
                              style: const TextStyle(fontSize: 16, color: Colors.black),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

            const SizedBox(height: 16),

            // Verification method section
            const Text(
              'Verification method',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),

            // Styled verification options
            buildVerificationOption('National Identity Card'),
            buildVerificationOption('Passport'),
            buildVerificationOption('Driver License'),

            const Spacer(),

            // Continue button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: selectedMethod != null
                    ? () {
                        // TODO: Add your continue logic here.
                      }
                    : null,
                child: const Text('Continue'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Function to return a flag image based on nationality name
  Widget _getFlag(String nationality, {double width = 32, double height = 20}) {
    String flagPath = 'assets/images/ethiopia_flag.png'; // Default flag

    for (var nation in nationalities) {
      if (nation['name'] == nationality) {
        flagPath = nation['flag']!;
        break;
      }
    }

    return Image.asset(flagPath, width: width, height: height, fit: BoxFit.cover);
  }

  Widget buildVerificationOption(String title) {
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedMethod = title;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: const Color(0xFFF3F8FF),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: selectedMethod == title ? Colors.blue : Colors.transparent,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.black),
            ),
            const Spacer(),
            if (selectedMethod == title)
              const Icon(Icons.check_circle, color: Colors.blue),
          ],
        ),
      ),
    );
  }
}
