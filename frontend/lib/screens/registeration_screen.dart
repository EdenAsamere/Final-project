import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/registration/registration_bloc.dart';
import '../blocs/registration/registration_event.dart';
import '../blocs/registration/registration_state.dart';
import '../models/user_model.dart';
import 'package:show_hide_password/show_hide_password.dart';
import 'login_screen.dart';

class RegistrationScreen extends StatefulWidget {
  @override
  _RegistrationScreenState createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  String? selectedCity;

  String? _validatePhoneNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required';
    }
    final phoneRegExp = RegExp(r'^[0-9]+$');
    if (!phoneRegExp.hasMatch(value)) {
      return 'Phone number must be numeric';
    }
    if (value.length != 9) {
      return 'Phone number must be 9 digits';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!RegExp(r'\d').hasMatch(value)) {
      return 'Password must contain at least one number';
    }
    if (!RegExp(r'[@\$!%*?&]').hasMatch(value)) {
      return 'Password must contain at least one special character (@, \$, !, %, *, ?, &)';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value != passwordController.text) {
      return 'Passwords do not match';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // This allows the screen to resize when the keyboard is shown.
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          // The SingleChildScrollView makes the content scrollable.
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Center(
                child: Text(
                  "Tell us about yourself",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: firstNameController,
                      decoration: InputDecoration(
                        labelText: "First Name",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    TextFormField(
                      controller: lastNameController,
                      decoration: InputDecoration(
                        labelText: "Last Name",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 15),
                    Row(
                      children: [
                        Container(
                          height: 48,
                          width: 80,
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            border: Border.all(color: Colors.grey),
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(8),
                              bottomLeft: Radius.circular(8),
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              "+251",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: TextFormField(
                            controller: phoneNumberController,
                            keyboardType: TextInputType.phone,
                            decoration: InputDecoration(
                              labelText: "Phone Number",
                              border: OutlineInputBorder(
                                borderRadius: const BorderRadius.only(
                                  topRight: Radius.circular(8),
                                  bottomRight: Radius.circular(8),
                                ),
                              ),
                            ),
                            validator: _validatePhoneNumber,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 15),
                    DropdownButtonFormField<String>(
                      value: selectedCity,
                      hint: const Text("City"),
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: [
                        "Addis Ababa",
                        "Dire Dawa",
                        "Bahir Dar",
                        "Gondar",
                        "Mekelle",
                        "Adama",
                        "Jimma",
                        "Hawassa",
                        "Dessie",
                        "Shashemene",
                        "Jijiga",
                        "Nekemte",
                        "Sodo",
                        "Debre Birhan",
                        "Asosa",
                        "Gambela",
                        "Harar",
                        "Shire",
                        "Ginir",
                        "Gode",
                        "Dolo Odo",
                        "Bule Hora",
                        "Robe",
                        "Agaro",
                        "Giyon",
                        "Metu",
                        "Yabelo",
                        "Bedele",
                        "Negele Boran",
                        "Asaita",
                        "Sebeta",
                        "Bati",
                        "Fiche",
                        "Gimbi",
                        "Mizan Teferi",
                        "Asela",
                        "Kombolcha",
                        "Goba",
                        "Debre Tabor",
                        "Filtu",
                        "Debre Marqos",
                        "Werota",
                        "Korem",
                        "Awasa",
                        "Bonga",
                        "Gimbi",
                        "Guder",
                        "Guraghe",
                        "Hagere Hiywet",
                        "Hosaina",
                        "Kemise",
                        "Kofele",
                        "Mendi",
                        "Merti",
                        "Moyale",
                        "Shakiso",
                        "Wendo",
                        "Yirga Alem",
                        "Ziway",
                        "Adigrat",
                        "Asebe Teferi",
                        "Bonga",
                        "Butajira",
                        "Chagni",
                        "Dabat",
                        "Dangla",
                        "Debre Markos",
                        "Debre Sina",
                        "Debre Tabor",
                        "Finote Selam",
                        "Gambela",
                        "Gedo",
                        "Gidole",
                        "Gimbi",
                        "Ginir",
                        "Goba",
                        "Gondar",
                        "Gore",
                        "Hagere Maryam",
                        "Hagere Selam",
                        "Harar",
                        "Hawassa",
                        "Hirna",
                        "Jijiga",
                        "Jimma",
                        "Kemise",
                        "Kemissie",
                        "Kibre Mengist",
                        "Kombolcha",
                        "Mekelle",
                        "Metehara",
                        "Metu",
                        "Mojo",
                        "Nekemte",
                        "Robe",
                        "Sebeta",
                        "Shashemene",
                        "Shire",
                        "Sire",
                        "Weldiya",
                        "Werota",
                        "Woldia",
                        "Woliso",
                        "Wondo Genet",
                        "Ziway",
                        "Addis Alem",
                        "Addis Zemen",
                        "Adet",
                        "Adis Zemen",
                        "Agaro",
                        "Akaki",
                        "Aksum",
                        "Alaba",
                        "Alitena",
                        "Amba Mariam",
                        "Ankober",
                        "Arba Minch",
                        "Asaita",
                        "Asasa",
                        "Asbe Teferi",
                        "Asosa",
                        "Awash",
                        "Awassa",
                        "Azezo",
                        "Babile",
                        "Baco",
                        "Bahir Dar",
                        "Bati",
                        "Bedele",
                      ]
                          .map((city) =>
                              DropdownMenuItem(value: city, child: Text(city)))
                          .toList(),
                      onChanged: (value) => setState(() => selectedCity = value),
                    ),
                    const SizedBox(height: 15),
                    ShowHidePassword(
                      passwordField: (bool hidePassword) {
                        return TextFormField(
                          controller: passwordController,
                          obscureText: hidePassword,
                          decoration: InputDecoration(
                            labelText: "Password",
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          validator: _validatePassword,
                        );
                      },
                    ),
                    const SizedBox(height: 15),
                    ShowHidePassword(
                      passwordField: (bool hidePassword) {
                        return TextFormField(
                          controller: confirmPasswordController,
                          obscureText: hidePassword,
                          decoration: InputDecoration(
                            labelText: "Confirm Password",
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          validator: _validateConfirmPassword,
                        );
                      },
                    ),
                    const SizedBox(height: 25),
                    BlocConsumer<RegistrationBloc, RegistrationState>(
                      listener: (context, state) {
                        if (state is RegistrationSuccess) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text("Registration successful!"),
                                backgroundColor: Colors.green),
                          );
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => LoginScreen(),
                            ),
                          );
                        }
                        if (state is RegistrationFailure) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                                content: Text(state.error),
                                backgroundColor: Colors.red),
                          );
                        }
                      },
                      builder: (context, state) {
                        return ElevatedButton(
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              final user = User(
                                firstName: firstNameController.text,
                                lastName: lastNameController.text,
                                phoneNumber: "+251${phoneNumberController.text}",
                                city: selectedCity ?? "",
                                password: passwordController.text,
                                confirmPassword: confirmPasswordController.text,
                              );
                              context
                                  .read<RegistrationBloc>()
                                  .add(RegisterUser(user));
                            }
                          },
                          child: Text("Register"),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
