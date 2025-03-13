import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equbapp/blocs/login/login_bloc.dart';
import 'package:equbapp/blocs/login/login_event.dart';
import 'package:equbapp/blocs/login/login_state.dart';
import 'package:equbapp/models/loginUser_model.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true; 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocConsumer<LoginBloc, LoginState>(
          listener: (context, state) {
            if (state is LoginFailure) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.error),
                  backgroundColor: Colors.red,
                  behavior: SnackBarBehavior.floating,
                ),
              );
            } else if (state is LoginSuccess) {
              Navigator.pushReplacementNamed(context, '/home');
            }
          },
          builder: (context, state) {
            return Column(
              children: [
                // Phone Number Input
                Row(
                  children: [
                    Container(
                      height: 48,
                      width: 80,
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(8),
                          bottomLeft: Radius.circular(8),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          "+251",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green),
                        ),
                      ),
                    ),
                    Expanded(
                      child: TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: InputDecoration(
                          labelText: "Phone Number",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.only(
                              topRight: Radius.circular(8),
                              bottomRight: Radius.circular(8),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 15),

                // Password Input with Show/Hide Icon
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: Colors.grey,
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword; // Toggle visibility
                        });
                      },
                    ),
                  ),
                ),
                SizedBox(height: 20),

                // Login Button
                ElevatedButton(
                  onPressed: () {
                    final loginBloc = context.read<LoginBloc>();
                    loginBloc.add(
                      LoginUser(
                        LoginUserModel(
                          phoneNumber: "+251${_phoneController.text.trim()}",
                          password: _passwordController.text,
                        ),
                      ),
                    );
                  },
                  child: state is LoginLoading
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text('Login'),
                ),

                // Register Navigation
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/register');
                  },
                  child: Text('Don\'t have an account? Register'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
